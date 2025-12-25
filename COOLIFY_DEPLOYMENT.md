# Deploying Notty on Coolify

This guide explains how to deploy the Notty note-taking application on [Coolify](https://coolify.io/), an open-source self-hostable platform.

## ⚠️ Common Pitfalls (Read First!)

Before deploying, be aware of these common issues:

| Issue                          | Solution                                                                      |
| ------------------------------ | ----------------------------------------------------------------------------- |
| **Bad Gateway**                | Set correct **Ports Exposes**: Frontend = `80`, Backend = `5000`              |
| **Frontend can't reach API**   | Set `VITE_API_URL` to backend URL **without** `/api` suffix, then **Rebuild** |
| **Login "Server Error"**       | Add `JWT_EXPIRE=7d` environment variable to backend                           |
| **Changes not taking effect**  | Use **Rebuild** not just Redeploy (Coolify caches images)                     |
| **Healthcheck failing**        | Already fixed in Dockerfile - uses `127.0.0.1` instead of `localhost`         |

## Prerequisites

- A server with Coolify installed ([Installation Guide](https://coolify.io/docs/get-started/installation))
- A domain name (or use Coolify's wildcard domain)
- Git repository access (GitHub, GitLab, or Bitbucket)

---

## Custom Domain Setup (Namecheap)

If you're using a domain from Namecheap, follow these steps to connect it to your Coolify deployment.

### Step 1: Get Your Coolify Server IP

Find your Coolify server's public IP address:

```bash
# SSH into your Coolify server and run:
curl ifconfig.me
```

### Step 2: Configure DNS Records in Namecheap

1. Log into your [Namecheap account](https://www.namecheap.com/)
2. Go to **Domain List** → Click **Manage** on your domain
3. Navigate to the **Advanced DNS** tab
4. Add the following A Records:

| Type     | Host      | Value             | TTL       | Purpose                                      |
| -------- | --------- | ----------------- | --------- | -------------------------------------------- |
| A Record | `@`       | `YOUR_COOLIFY_IP` | Automatic | Main frontend (`yourdomain.com`)             |
| A Record | `www`     | `YOUR_COOLIFY_IP` | Automatic | WWW subdomain (`www.yourdomain.com`)         |
| A Record | `api`     | `YOUR_COOLIFY_IP` | Automatic | Backend API (`api.yourdomain.com`)           |
| A Record | `coolify` | `YOUR_COOLIFY_IP` | Automatic | Coolify Dashboard (`coolify.yourdomain.com`) |

> **Note**: Replace `YOUR_COOLIFY_IP` with your actual server IP address.

### Step 3: Configure Coolify Dashboard Domain

After DNS propagation (may take up to 48 hours, usually much faster):

#### Option A: Via SSH

```bash
# Edit the Coolify environment file
nano /data/coolify/source/.env

# Update/Add the APP_URL variable
APP_URL=https://coolify.yourdomain.com

# Restart Coolify
cd /data/coolify/source
docker compose down
docker compose up -d
```

#### Option B: Via Coolify UI

1. Access Coolify dashboard using your server IP
2. Navigate to **Settings** → **Configuration**
3. Update **Instance's Domain** to `https://coolify.yourdomain.com`
4. Save and restart

### Step 4: Configure Application Domains in Coolify

**Backend Domain:**

1. Go to your Backend resource → **Settings** → **Domains**
2. Add: `https://api.yourdomain.com`
3. Ensure **Ports Exposes** is set to `5000`

**Frontend Domain:**

1. Go to your Frontend resource → **Settings** → **Domains**
2. Add: `https://yourdomain.com` and `https://www.yourdomain.com`
3. Ensure **Ports Exposes** is set to `80`

### Step 5: Update Frontend Environment Variable

After configuring domains:

1. Go to Frontend resource → **Environment Variables**
2. Set: `VITE_API_URL=https://api.yourdomain.com`
3. **Important**: Click **Rebuild** (not just Redeploy)

### Verify DNS Propagation

Check if your DNS records have propagated:

- Visit [whatsmydns.net](https://www.whatsmydns.net/)
- Enter your domain and check for your server IP

### Domain Summary

| Domain                   | Service           | Port |
| ------------------------ | ----------------- | ---- |
| `yourdomain.com`         | Frontend (Nginx)  | 80   |
| `www.yourdomain.com`     | Frontend (Nginx)  | 80   |
| `api.yourdomain.com`     | Backend (Node.js) | 5000 |
| `coolify.yourdomain.com` | Coolify Dashboard | 8000 |

## Architecture Overview

The Notty application consists of three components:

1. **MongoDB** - Database (deployed as a Coolify Database service)
2. **Backend** - Node.js/Express API server
3. **Frontend** - React application served via Nginx

```text
┌─────────────────────────────────────────────────────────────┐
│                         Coolify                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │   Frontend  │───▶│   Backend   │───▶│   MongoDB   │     │
│  │   (Nginx)   │    │  (Node.js)  │    │  (Database) │     │
│  │   :80       │    │   :5000     │    │   :27017    │     │
│  └─────────────┘    └─────────────┘    └─────────────┘     │
│        │                                                    │
│        ▼                                                    │
│   https://notty.yourdomain.com                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Step 1: Deploy MongoDB Database

1. In Coolify dashboard, go to your **Project** → **Environment**
2. Click **+ New** → **Database** → **MongoDB**
3. Configure MongoDB:
   - **Name**: `notty-mongodb`
   - **Version**: `7.0` (or latest stable)
   - Leave other settings as default (Coolify will generate secure credentials)
4. Click **Save** then **Deploy**
5. Once deployed, note the following from the MongoDB resource page:
   - **Internal Host**: Usually `notty-mongodb` or the container name
   - **Port**: `27017`
   - **Username**: (auto-generated, check in Coolify UI)
   - **Password**: (auto-generated, check in Coolify UI)
   - **Connection String**: Will look like `mongodb://username:password@notty-mongodb:27017/notty?authSource=admin`

> **Important**: Enable **Connect to Predefined Network** on the MongoDB database so other services can connect to it.

---

## Step 2: Deploy Backend (API Server)

### Option A: Deploy from Git Repository

1. Push your code to a Git repository (GitHub, GitLab, etc.)
2. In Coolify, go to your **Project** → **Environment**
3. Click **+ New** → **Application** → Select your Git provider
4. Select your repository and configure:
   - **Branch**: `main`
   - **Build Pack**: `Dockerfile`
   - **Dockerfile Location**: `server/Dockerfile`
   - **Base Directory**: `server`
5. Configure the **Domain**:
   - Set domain like `api.notty.yourdomain.com` or use Coolify's auto-generated domain
   - Add port `:5000` if needed (e.g., `https://api.notty.yourdomain.com:5000`)

### Option B: Deploy using Docker Compose

1. Go to **+ New** → **Service** → **Docker Compose Empty**
2. Paste the following compose configuration:

```yaml
services:
  backend:
    build:
      context: ./server
      dockerfile: Dockerfile
    environment:
      - NODE_ENV=production
      - PORT=5000
      - MONGODB_URI=${MONGODB_URI:?}
      - JWT_SECRET=${JWT_SECRET:?}
    volumes:
      - uploads:/app/uploads
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:5000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  uploads:
```

### Environment Variables for Backend

Set the following environment variables in Coolify:

| Variable      | Description                   | Example                                                          | Required |
| ------------- | ----------------------------- | ---------------------------------------------------------------- | -------- |
| `NODE_ENV`    | Environment mode              | `production`                                                     | Yes      |
| `PORT`        | Server port                   | `5000`                                                           | Yes      |
| `MONGODB_URI` | MongoDB connection string     | `mongodb://user:pass@notty-mongodb:27017/notty?authSource=admin` | Yes      |
| `JWT_SECRET`  | Secret for JWT tokens         | Generate a secure random string (32+ chars)                      | Yes      |
| `JWT_EXPIRE`  | Token expiration time         | `7d` (7 days), `30d`, `24h`                                      | Yes      |

> **Tip**: Use Coolify's magic variables for passwords: `${SERVICE_PASSWORD_64_BACKEND}` to auto-generate a secure JWT secret.

### Configuring the Domain and Port

1. In the backend resource settings, go to **Settings**
2. Set **Ports Exposes** to `5000` (the port your backend listens on)
3. Go to **Domains** and add your domain: `https://api.notty.yourdomain.com`
4. Coolify will automatically configure SSL via Let's Encrypt

---

## Step 3: Deploy Frontend

1. In Coolify, go to your **Project** → **Environment**
2. Click **+ New** → **Application** → Select your Git provider
3. Select your repository and configure:
   - **Branch**: `main`
   - **Build Pack**: `Dockerfile`
   - **Dockerfile Location**: `client/Dockerfile`
   - **Base Directory**: `client`
4. Set **Build Arguments**:
   - `VITE_API_URL`: Your backend URL (e.g., `https://api.notty.yourdomain.com`)

### Environment Variables for Frontend (Build-time)

| Variable       | Description                         | Example                             |
| -------------- | ----------------------------------- | ----------------------------------- |
| `VITE_API_URL` | Backend base URL (without `/api`)   | `https://api.notty.yourdomain.com`  |

> **Important**:
>
> - Set `VITE_API_URL` to the backend URL **without** the `/api` suffix. The app automatically appends `/api` to the URL.
> - This is a **build argument**, not a runtime environment variable. Set it in the Environment Variables section in Coolify.
> - After changing this value, you must **Rebuild** (not just Redeploy) for changes to take effect.

### Configuring Frontend Domain and Port

1. In the frontend resource settings, go to **Settings**
2. **Important**: Set **Ports Exposes** to `80` (Nginx serves on port 80, not 3000)
3. Go to **Domains** and add your domain: `https://notty.yourdomain.com`
4. The frontend uses Nginx to serve the built React app on port 80

---

## Step 4: Configure Networking

### Enable Predefined Network Connection

For the backend to communicate with MongoDB:

1. Go to your **MongoDB** resource → **Settings**
2. Enable **Connect to Predefined Network**
3. Go to your **Backend** resource → **Settings**
4. Enable **Connect to Predefined Network**

This allows services to communicate using their container names as hostnames.

### CORS Configuration

The backend is already configured with CORS enabled. If you need to restrict origins, update `server/index.js`:

```javascript
app.use(cors({
  origin: 'https://notty.yourdomain.com',
  credentials: true
}));
```

---

## Step 5: Persistent Storage

### Backend Uploads

The backend stores uploaded files in the `/app/uploads` directory. To persist this data:

1. Go to your **Backend** resource → **Storages**
2. Add a new volume:
   - **Source**: `notty-uploads` (volume name)
   - **Destination**: `/app/uploads`

### MongoDB Data

MongoDB data is automatically persisted by Coolify when deployed as a Database resource.

---

## Complete Docker Compose (Alternative)

If you prefer deploying everything as a single Docker Compose stack:

```yaml
services:
  frontend:
    build:
      context: ./client
      dockerfile: Dockerfile
      args:
        - VITE_API_URL=${VITE_API_URL:-http://backend:5000}
    environment:
      - SERVICE_FQDN_FRONTEND
    depends_on:
      - backend
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:80"]
      interval: 30s
      timeout: 10s
      retries: 3

  backend:
    build:
      context: ./server
      dockerfile: Dockerfile
    environment:
      - NODE_ENV=production
      - PORT=5000
      - MONGODB_URI=${MONGODB_URI:?mongodb://mongodb:27017/notty}
      - JWT_SECRET=${JWT_SECRET:?}
      - SERVICE_FQDN_BACKEND_5000
    volumes:
      - uploads:/app/uploads
    depends_on:
      - mongodb
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:5000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  mongodb:
    image: mongo:7.0
    environment:
      - MONGO_INITDB_ROOT_USERNAME=${MONGO_USER:-notty}
      - MONGO_INITDB_ROOT_PASSWORD=${MONGO_PASSWORD:?}
    volumes:
      - mongodb_data:/data/db
    healthcheck:
      test: ["CMD", "mongosh", "--eval", "db.adminCommand('ping')"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  uploads:
  mongodb_data:
```

### Environment Variables for Complete Stack

| Variable         | Description                    | Example                                                            |
| ---------------- | ------------------------------ | ------------------------------------------------------------------ |
| `VITE_API_URL`   | Backend API URL for frontend   | `https://api.notty.yourdomain.com`                                 |
| `MONGODB_URI`    | Full MongoDB connection string | `mongodb://notty:pass@mongodb:27017/notty?authSource=admin`        |
| `JWT_SECRET`     | Secret for JWT tokens          | (generate secure string)                                           |
| `MONGO_USER`     | MongoDB root username          | `notty`                                                            |
| `MONGO_PASSWORD` | MongoDB root password          | (generate secure string)                                           |

---

## Deployment Checklist

- [ ] MongoDB deployed and running
- [ ] MongoDB credentials noted
- [ ] Backend deployed with correct environment variables:
  - [ ] `NODE_ENV=production`
  - [ ] `PORT=5000`
  - [ ] `MONGODB_URI` (connection string with credentials)
  - [ ] `JWT_SECRET` (secure random string)
  - [ ] `JWT_EXPIRE` (e.g., `7d`)
- [ ] Backend **Ports Exposes** set to `5000`
- [ ] Backend domain configured with SSL
- [ ] Frontend deployed with `VITE_API_URL` (backend URL without `/api`)
- [ ] Frontend **Ports Exposes** set to `80`
- [ ] Frontend domain configured with SSL
- [ ] Predefined network enabled for service communication
- [ ] Persistent storage configured for uploads
- [ ] Test the application:
  - [ ] Can access frontend URL
  - [ ] Can register a new account
  - [ ] Can login
  - [ ] Can create notebooks and notes

---

## Troubleshooting

### Bad Gateway Error

This usually means Coolify's proxy can't reach your container:

1. **Check the Ports Exposes setting**:
   - Frontend should be `80` (Nginx)
   - Backend should be `5000` (Node.js)
2. Verify the container is running and healthy in Coolify logs
3. Rebuild the application if you recently changed the Dockerfile

### Healthcheck Failing (Connection Refused)

If you see healthcheck errors like `wget: can't connect to remote host`:

1. Make sure the Dockerfile healthcheck uses `127.0.0.1` instead of `localhost` (IPv6 issues on Alpine)
2. Verify the port in healthcheck matches the port your app listens on
3. Check container logs for startup errors

### Backend can't connect to MongoDB

1. Verify MongoDB is running in Coolify
2. Check that **Connect to Predefined Network** is enabled on both services
3. Verify the `MONGODB_URI` environment variable is correct
4. Check MongoDB container name matches the hostname in the connection string

### Login Returns "Server Error"

This is usually caused by missing environment variables:

1. Make sure `JWT_SECRET` is set in backend environment variables
2. Make sure `JWT_EXPIRE` is set (e.g., `7d`)
3. Check backend logs in Coolify for the actual error

### Frontend Shows API Errors / Network Errors

1. **Check VITE_API_URL**: Should be the backend URL without `/api` suffix (e.g., `https://api.notty.yourdomain.com`)
2. **Rebuild required**: After changing `VITE_API_URL`, you must **Rebuild** (not just Redeploy) the frontend
3. Check browser console (F12) for the actual API URL being called
4. Verify backend is running and accessible by visiting `https://api.notty.yourdomain.com/api/health`
5. Check for CORS errors in browser console

### Image Cache Issues

Coolify caches Docker images. If your changes aren't taking effect:

1. Go to your resource in Coolify
2. Click **Rebuild** instead of **Redeploy**
3. Or enable **Force Rebuild** in settings

### Uploads not persisting

1. Ensure a volume is mounted to `/app/uploads` on the backend
2. Check volume permissions

### SSL Certificate Issues

1. Ensure your domain DNS is pointing to your Coolify server
2. Wait a few minutes for Let's Encrypt to issue certificates
3. Check Coolify logs for certificate errors

---

## Useful Commands

### Check service logs in Coolify

Navigate to your resource → **Logs** tab

### Access MongoDB shell

```bash
# From Coolify terminal or SSH into server
docker exec -it <mongodb-container-name> mongosh -u <username> -p <password>
```

### Rebuild and redeploy

In Coolify, go to your resource and click **Redeploy** or **Rebuild**

---

## Security Recommendations

1. **Use strong passwords**: Let Coolify generate passwords using magic variables
2. **Enable SSL**: Always use HTTPS domains
3. **Restrict CORS**: Update backend to only allow your frontend domain
4. **Regular backups**: Enable automatic backups for MongoDB in Coolify
5. **Keep updated**: Regularly update your Docker images and dependencies

---

## Support

- [Coolify Documentation](https://coolify.io/docs/)
- [Coolify Discord](https://discord.gg/coolify)
- [MongoDB Documentation](https://www.mongodb.com/docs/)
