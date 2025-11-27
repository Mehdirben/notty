# Deploying Notty on Coolify

This guide explains how to deploy the Notty note-taking application on [Coolify](https://coolify.io/), an open-source self-hostable platform.

## Prerequisites

- A server with Coolify installed ([Installation Guide](https://coolify.io/docs/get-started/installation))
- A domain name (or use Coolify's wildcard domain)
- Git repository access (GitHub, GitLab, or Bitbucket)

## Architecture Overview

The Notty application consists of three components:

1. **MongoDB** - Database (deployed as a Coolify Database service)
2. **Backend** - Node.js/Express API server
3. **Frontend** - React application served via Nginx

```
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

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://user:pass@notty-mongodb:27017/notty?authSource=admin` |
| `JWT_SECRET` | Secret for JWT tokens | Generate a secure random string (32+ chars) |

> **Tip**: Use Coolify's magic variables for passwords: `${SERVICE_PASSWORD_64_BACKEND}` to auto-generate a secure JWT secret.

### Configuring the Domain

1. In the backend resource settings, go to **Domains**
2. Add your domain: `https://api.notty.yourdomain.com:5000`
3. Coolify will automatically configure SSL via Let's Encrypt

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

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://api.notty.yourdomain.com` |

> **Note**: This is a **build argument**, not a runtime environment variable. Set it in the Build Arguments section.

### Configuring the Domain

1. In the frontend resource settings, go to **Domains**
2. Add your domain: `https://notty.yourdomain.com`
3. The frontend listens on port 80 internally

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

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL for frontend | `https://api.notty.yourdomain.com` |
| `MONGODB_URI` | Full MongoDB connection string | `mongodb://notty:password@mongodb:27017/notty?authSource=admin` |
| `JWT_SECRET` | Secret for JWT tokens | (generate secure string) |
| `MONGO_USER` | MongoDB root username | `notty` |
| `MONGO_PASSWORD` | MongoDB root password | (generate secure string) |

---

## Deployment Checklist

- [ ] MongoDB deployed and running
- [ ] MongoDB credentials noted
- [ ] Backend deployed with correct environment variables
- [ ] Backend domain configured with SSL
- [ ] Frontend deployed with `VITE_API_URL` build argument
- [ ] Frontend domain configured with SSL
- [ ] Predefined network enabled for service communication
- [ ] Persistent storage configured for uploads
- [ ] Test the application by creating an account and a note

---

## Troubleshooting

### Backend can't connect to MongoDB

1. Verify MongoDB is running in Coolify
2. Check that **Connect to Predefined Network** is enabled on both services
3. Verify the `MONGODB_URI` environment variable is correct
4. Check MongoDB container name matches the hostname in the connection string

### Frontend shows API errors

1. Verify the `VITE_API_URL` build argument is set correctly
2. Rebuild the frontend after changing the API URL
3. Check browser console for CORS errors
4. Verify backend is running and accessible

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
