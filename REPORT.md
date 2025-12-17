# Notty - Modern Note-Taking Platform

<div align="center">
  <h2>Technical Project Report</h2>
  <p><em>Your Ideas, Beautifully Organized</em></p>
  
  | Aspect | Details |
  |--------|---------|
  | **Technologies** | React, Node.js, Express, MongoDB |
  | **Architecture** | Full-Stack with Docker |
  | **Deployment** | Coolify / Docker Compose |

</div>

---

## Table of Contents

1. [Introduction](#introduction)
2. [Features](#features)
3. [Technical Architecture](#technical-architecture)
4. [Project Structure](#project-structure)
5. [REST API](#rest-api)
6. [Data Models](#data-models)
7. [Keyboard Shortcuts](#keyboard-shortcuts)
8. [Deployment](#deployment)
9. [Screenshots](#screenshots)
10. [Installation and Configuration](#installation-and-configuration)
11. [Security Considerations](#security-considerations)
12. [Conclusion](#conclusion)

---

## Introduction

### Project Overview

**Notty** is a modern note-taking platform designed to provide a smooth and feature-rich user experience. This full-stack web application allows users to create, organize, and manage their notes intuitively with a rich text editor.

The application is built with a modern architecture that clearly separates the frontend from the backend, facilitating maintenance, scalability, and independent deployment of each component.

### Project Objectives

- **Ease of use**: Intuitive interface with dark mode support
- **Productivity**: Rich editor with keyboard shortcuts and auto-save
- **Organization**: Customizable notebook system with icons and colors
- **Security**: JWT authentication with secure session management
- **Flexible deployment**: Docker and Coolify support for easy deployment

---

## Features

### Secure Authentication

- User registration and login
- JWT-based authentication (JSON Web Tokens)
- User profile management
- Secure sessions with configurable expiration

### Notebook Management

- Create multiple notebooks to organize notes
- Customization with emoji icons (notebook, briefcase, lightbulb, etc.)
- Custom color assignment
- Hierarchical content organization

### Rich Text Editor

The editor uses **TipTap**, a rich editor framework based on ProseMirror, offering:

- **Basic formatting**: Bold, italic, strikethrough
- **Headings**: H1, H2, H3
- **Lists**: Bullet and numbered lists
- **Task lists**: Checkboxes for todo tracking
- **Code blocks**: Syntax highlighting with Highlight.js
- **Images**: Upload and image integration
- **Links**: Hyperlink creation and management
- **Blockquotes**: Styled quotation blocks

### Advanced Features

| Feature | Description |
|---------|-------------|
| ⭐ Favorites | Mark important notes for quick access |
| 📌 Pin | Pin notes to the top of the list |
| 🔍 Search | Global search (Cmd/Ctrl+K) |
| 🌙 Dark Mode | Elegant dark theme by default |
| 💾 Auto-save | Automatic saving while typing |
| 📱 Responsive | Desktop and mobile compatible |
| 📄 XML Export | Import/export notes in XML format |

---

## Technical Architecture

### Overview

The application follows a classic **three-tier** architecture:

```
┌─────────────┐       REST API       ┌─────────────┐      Mongoose      ┌─────────────┐
│  Frontend   │  ─────────────────▶  │   Backend   │ ─────────────────▶ │  MongoDB    │
│   React     │                      │  Express.js │                    │  Database   │
│   :3000     │                      │    :5000    │                    │   :27017    │
└─────────────┘                      └─────────────┘                    └─────────────┘
```

### Technology Stack

#### Frontend

| Technology | Role | Version |
|------------|------|---------|
| React | UI Framework | 18.2.0 |
| Vite | Build tool and development server | 5.0.8 |
| TailwindCSS | Utility-first CSS framework | 3.4.0 |
| Framer Motion | Smooth animations | 10.16.16 |
| TipTap | Rich text editor | 2.1.13 |
| Zustand | Lightweight state management | 4.4.7 |
| React Router DOM | Client-side routing | 6.21.1 |
| Axios | HTTP client | 1.6.2 |
| Lucide React | Icon library | 0.303.0 |

#### Backend

| Technology | Role | Version |
|------------|------|---------|
| Node.js | JavaScript runtime | 18+ |
| Express.js | Web framework | 4.18.2 |
| MongoDB | NoSQL database | 7.0 |
| Mongoose | MongoDB ODM | 8.0.3 |
| JWT (jsonwebtoken) | Authentication | 9.0.2 |
| bcryptjs | Password hashing | 2.4.3 |
| Multer | File uploads | 1.4.5-lts.1 |
| xml2js | XML processing | 0.6.2 |
| express-validator | Data validation | 7.0.1 |

---

## Project Structure

```text
notty_react/
├── client/                 # React Frontend
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── api/          # API configuration (Axios)
│   │   ├── components/   # Reusable React components
│   │   │   ├── CreateNotebookModal.jsx
│   │   │   ├── Layout.jsx
│   │   │   ├── NoteCard.jsx
│   │   │   ├── NotebookCard.jsx
│   │   │   ├── RichTextEditor.jsx
│   │   │   ├── SearchModal.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── pages/        # Application pages
│   │   │   ├── Dashboard.jsx
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── NotePage.jsx
│   │   │   ├── NotebookPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   └── SettingsPage.jsx
│   │   ├── store/        # Zustand stores
│   │   ├── hooks/        # Custom hooks
│   │   ├── App.jsx       # Main component
│   │   └── main.jsx      # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── server/                # Express Backend
│   ├── config/           # Configuration (DB)
│   ├── middleware/       # Middlewares (Auth)
│   ├── models/           # Mongoose models
│   │   ├── Note.js
│   │   ├── Notebook.js
│   │   └── User.js
│   ├── routes/           # API routes
│   │   ├── auth.js
│   │   ├── notebooks.js
│   │   ├── notes.js
│   │   └── upload.js
│   ├── uploads/          # Uploaded files
│   ├── index.js          # Server entry point
│   └── package.json
│
├── assets/               # Screenshots and resources
├── docker-compose.yml    # Docker configuration
└── package.json          # Root scripts
```

---

## REST API

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register a new user |
| POST | /api/auth/login | User login |
| GET | /api/auth/me | Get current user |
| PUT | /api/auth/profile | Update profile |

### Notebook Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/notebooks | List all notebooks |
| GET | /api/notebooks/:id | Get a specific notebook |
| POST | /api/notebooks | Create a new notebook |
| PUT | /api/notebooks/:id | Update a notebook |
| DELETE | /api/notebooks/:id | Delete a notebook |

### Note Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/notes | List notes (with filters) |
| GET | /api/notes/:id | Get a specific note |
| GET | /api/notes/:id/xml | Export note as XML |
| POST | /api/notes | Create a new note |
| PUT | /api/notes/:id | Update a note |
| DELETE | /api/notes/:id | Delete a note |
| POST | /api/notes/import-xml | Import note from XML |

### Upload Endpoint

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/upload | Upload image |

---

## Data Models

### User Model

```javascript
const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String },
    createdAt: { type: Date, default: Date.now }
});
```

### Notebook Model

```javascript
const NotebookSchema = new Schema({
    name: { type: String, required: true },
    icon: { type: String, default: 'notebook' },
    color: { type: String, default: '#6366f1' },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now }
});
```

### Note Model

```javascript
const NoteSchema = new Schema({
    title: { type: String, required: true },
    content: { type: String },
    notebook: { type: Schema.Types.ObjectId, ref: 'Notebook' },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isFavorite: { type: Boolean, default: false },
    isPinned: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
```

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Cmd/Ctrl + K | Open global search |
| Cmd/Ctrl + S | Save note |
| Cmd/Ctrl + B | Bold |
| Cmd/Ctrl + I | Italic |
| Escape | Close modals |

---

## Deployment

### Deployment Architecture

The application can be deployed in several ways:

1. **Local development**: npm run dev
2. **Docker Compose**: For a containerized local environment
3. **Coolify**: Self-hosted hosting platform

### Docker Compose

```yaml
services:
  frontend:
    build:
      context: ./client
      dockerfile: Dockerfile
      args:
        - VITE_API_URL=http://localhost:5000
    ports:
      - "3000:80"
    depends_on:
      backend:
        condition: service_healthy

  backend:
    build:
      context: ./server
      dockerfile: Dockerfile
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - PORT=5000
      - MONGODB_URI=mongodb://notty:nottypassword@mongodb:27017/notty
      - JWT_SECRET=your-super-secret-jwt-key

  mongodb:
    image: mongo:7.0
    ports:
      - "27017:27017"
    environment:
      - MONGO_INITDB_ROOT_USERNAME=notty
      - MONGO_INITDB_ROOT_PASSWORD=nottypassword
    volumes:
      - mongodb_data:/data/db

volumes:
  uploads:
  mongodb_data:
```

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Backend server port | 5000 |
| MONGODB_URI | MongoDB connection string | mongodb://... |
| JWT_SECRET | Secret key for JWT | (random string) |
| JWT_EXPIRE | Token expiration duration | 7d |
| VITE_API_URL | API URL for frontend | <http://localhost:5000> |

---

## Screenshots

### Landing Page

The landing page presents the application with a modern and attractive design.

![Notty Landing Page](assets/home.png)

### Login Page

Elegant authentication interface with login form.

![Login Page](assets/login.png)

### Dashboard

The dashboard displays user notebooks and notes with intuitive navigation.

![Dashboard](assets/dashboard.png)

### Note Editor

The rich editor allows creating formatted content with numerous options.

![Note Editor with Rich Formatting](assets/note.png)

---

## Installation and Configuration

### Prerequisites

- Node.js 18 or higher
- MongoDB (local or Atlas)
- npm or yarn
- Docker (optional, for containerized deployment)

### Local Installation

```bash
# 1. Clone the repository
git clone <repository-url>
cd notty_react

# 2. Install dependencies
npm run install:all

# 3. Configure environment variables
# Edit server/.env with your settings

# 4. Start MongoDB
mongod

# 5. Run the application
npm run dev

# The application will be available at:
# Frontend: http://localhost:3000
# Backend:  http://localhost:5000
```

### Backend Configuration

Create a `server/.env` file with the following content:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/notty
JWT_SECRET=your-very-long-secret-key-change-in-production
JWT_EXPIRE=7d
```

---

## Security Considerations

> [!WARNING]
> **Security Recommendations**
>
> - Use strong and unique passwords for JWT_SECRET
> - Always use HTTPS in production
> - Configure CORS to only allow authorized domains
> - Regularly update dependencies
> - Enable automatic MongoDB backups
> - Never expose credentials in source code

### Implemented Measures

- **Password hashing**: bcryptjs for secure storage
- **JWT**: Tokens with configurable expiration
- **Validation**: express-validator for input validation
- **CORS**: Strict configuration possible

---

## Conclusion

Notty represents a modern and comprehensive solution for note-taking, combining an elegant user interface with a robust backend architecture. The main strengths of the project include:

- **Modern stack**: Using the latest technologies (React 18, Vite, TailwindCSS)
- **User experience**: Responsive interface with dark mode and smooth animations
- **Powerful editor**: TipTap offers a professional editing experience
- **Flexible deployment**: Docker and Coolify support for different scenarios
- **Maintainable code**: Clear architecture separating frontend and backend
