# NoteVerse Backend Documentation

## 📁 Folder Structure

```
backend/
├── index.js              # Main server (Express + routes)
├── db.js                 # MongoDB connection
├── package.json          # Dependencies
├── middleware/
│   └── authenticateToken.js  # JWT auth middleware
├── models/
│   ├── User.js          # User schema
│   └── Note.js          # Note schema  
└── routes/
    ├── auth.js          # Auth routes
    └── notes.js         # Note CRUD routes
```

## 🗃️ What Each File Does

**`index.js`** - Main Express server file. Sets up CORS, JSON parsing, mounts auth & notes routes, handles 404s and global errors, starts server on port 5000

**`db.js`** - Database connection file. Connects to MongoDB at `mongodb://localhost:27017/noteVerse`, logs success/failure, exits process if connection fails

**`authenticateToken.js`** - JWT middleware. Extracts Bearer token from headers, verifies with JWT_SECRET, attaches decoded user info to `req.user`, protects routes

**`User.js`** - User database model. Schema with name (required), email (unique), password (hashed), auto timestamps, uses Mongoose

**`Note.js`** - Note database model. Schema with user reference, title, description, tag (default: "General"), auto timestamps, links to User model

**`auth.js`** - Authentication routes. 3 endpoints: register (with strong validation), login (bcrypt password check), get user profile (JWT protected)

**`notes.js`** - Notes CRUD routes. 4 endpoints: fetch all user notes, add new note, update existing note, delete note (all JWT protected with user ownership checks)

## 🌐 API Endpoints

| Method | Endpoint                      | Auth | Purpose        |
| ------ | ----------------------------- | ---- | -------------- |
| POST   | `/api/auth/register`        | ❌   | Create account |
| POST   | `/api/auth/login`           | ❌   | Login user     |
| GET    | `/api/auth/user`            | ✅   | Get profile    |
| GET    | `/api/notes/fetchallnotes`  | ✅   | Get all notes  |
| POST   | `/api/notes/addnote`        | ✅   | Create note    |
| PUT    | `/api/notes/updatenote/:id` | ✅   | Update note    |
| DELETE | `/api/notes/deletenote/:id` | ✅   | Delete note    |

## 🔐 Security Features

- **Password**: Bcrypt hashing (12 rounds)
- **Auth**: JWT tokens (7 days expiry)
- **Validation**: Strong password rules, input validation
- **Authorization**: Users can only access their own notes

## 🚀 To Run

```bash
npm install
node index.js
# Server starts on port 5000
# Needs MongoDB running locally
```
