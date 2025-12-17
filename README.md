# 📝 Notty - Modern Note-Taking Platform

<div align="center">
  <img src="client/public/notty-icon.svg" alt="Notty Logo" width="120" />
  <h3>Your Ideas, Beautifully Organized</h3>
  <p>A modern, feature-rich note-taking platform built with React, Node.js, Express, and MongoDB</p>
  
  <br />
  
  **[🚀 Deploy on Coolify](./COOLIFY_DEPLOYMENT.md)** | **[📖 Documentation](#-getting-started)**
</div>

---

## ✨ Features

- 🔐 **Secure Authentication** - User registration and login with JWT tokens
- 📓 **Multiple Notebooks** - Organize notes into customizable notebooks with icons and colors
- 📝 **Rich Text Editor** - Full-featured editor with:
  - Bold, italic, strikethrough formatting
  - Headings (H1, H2, H3)
  - Bullet and numbered lists
  - ✅ Task/Todo lists with checkboxes
  - 💻 Code blocks with syntax highlighting
  - 🖼️ Image uploads
  - 🔗 Links
  - Blockquotes
- ⭐ **Favorites** - Star important notes for quick access
- 📌 **Pin Notes** - Pin notes to the top of your list
- 🔍 **Search** - Quick search across all your notes (⌘K / Ctrl+K)
- 🌙 **Dark/Light Mode** - Beautiful dark theme by default
- 💾 **Auto-save** - Notes are automatically saved as you type
- 📱 **Responsive Design** - Works on desktop and mobile
- 🗃️ **XML Support** - Notes can be exported/imported as XML

## 🛠️ Tech Stack

### Frontend

- React 18
- Vite
- TailwindCSS
- Framer Motion (animations)
- TipTap (rich text editor)
- Zustand (state management)
- React Router DOM
- Axios

### Backend

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Multer (file uploads)
- xml2js (XML processing)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   cd notty_react
   ```

2. **Install dependencies**

   ```bash
   npm run install:all
   ```

   Or install separately:

   ```bash
   npm install
   cd server && npm install
   cd ../client && npm install
   ```

3. **Configure environment variables**

   Edit `server/.env`:

   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/notty
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   JWT_EXPIRE=7d
   ```

4. **Start MongoDB**

   ```bash
   # If using local MongoDB
   mongod
   ```

5. **Run the application**

   ```bash
   # From root directory - runs both frontend and backend
   npm run dev
   ```

   Or run separately:

   ```bash
   # Terminal 1 - Backend
   npm run server
   
   # Terminal 2 - Frontend  
   npm run client
   ```

6. **Open the app**
   - Frontend: <http://localhost:3000>
   - Backend API: <http://localhost:5000>

## 📁 Project Structure

```text
notty_react/
├── client/                 # React frontend
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── api/          # API configuration
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── store/        # Zustand stores
│   │   ├── App.jsx       # Main app component
│   │   └── main.jsx      # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── server/                # Express backend
│   ├── config/           # Database config
│   ├── middleware/       # Auth middleware
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── uploads/          # Uploaded files
│   ├── index.js          # Server entry
│   └── package.json
│
└── package.json          # Root package.json
```

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Notebooks

- `GET /api/notebooks` - Get all notebooks
- `GET /api/notebooks/:id` - Get single notebook
- `POST /api/notebooks` - Create notebook
- `PUT /api/notebooks/:id` - Update notebook
- `DELETE /api/notebooks/:id` - Delete notebook

### Notes

- `GET /api/notes` - Get all notes (with filters)
- `GET /api/notes/:id` - Get single note
- `GET /api/notes/:id/xml` - Get note as XML
- `POST /api/notes` - Create note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note
- `POST /api/notes/import-xml` - Import note from XML

### Upload

- `POST /api/upload` - Upload image

## ⌨️ Keyboard Shortcuts

- `⌘/Ctrl + K` - Open search
- `⌘/Ctrl + S` - Save note
- `⌘/Ctrl + B` - Bold
- `⌘/Ctrl + I` - Italic
- `Escape` - Close modals

## 🎨 Customization

### Notebook Colors & Icons

Each notebook can have:

- Custom emoji icon (📓, 💼, 💡, etc.)
- Custom color accent

### Theme

Toggle between dark and light mode in Settings or sidebar.

## 📄 License

MIT License - feel free to use this project for learning or production!

## 🙏 Acknowledgments

- [TipTap](https://tiptap.dev/) - Amazing rich text editor
- [Lucide Icons](https://lucide.dev/) - Beautiful icons
- [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS
- [Framer Motion](https://www.framer.com/motion/) - Smooth animations

---

<div align="center">
  Built with ❤️ for productivity lovers
</div>
