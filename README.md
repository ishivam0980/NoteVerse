# NoteVerse

A full-stack note-taking web application built with React and Node.js. Create, edit, delete, and manage your personal notes with secure user authentication.

## Features

- **🔐 User Authentication** - Secure signup/login with JWT tokens
- **📝 Personal Notes** - Create, edit, delete, and organize your notes
- **🔒 Security** - Password hashing with bcrypt, protected routes
- **📱 Responsive Design** - Works seamlessly on desktop and mobile
- **⚡ Real-time Updates** - Changes reflect immediately without page refresh
- **🎨 Modern UI** - Clean interface built with Bootstrap

## Tech Stack

**Frontend:** React 18, React Router, Context API, Bootstrap, Axios
**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, Bcrypt
**Database:** MongoDB with Mongoose ODM

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MongoDB running locally on default port (27017)
- Git

### Installation

1. Clone the repository

```bash
git clone https://github.com/ishivam0980/NoteVerse.git
cd NoteVerse
```

2. Setup Backend

```bash
cd backend
npm install
```

3. Environment Configuration

Create a `.env` file in the `backend` directory:

```env
JWT_SECRET=your-super-secret-jwt-key
MONGO_URI=mongodb://localhost:27017/noteVerse
```

**Note:** If no `.env` file is provided, the app will use default values, but it's recommended to set your own JWT secret for security.

4. Setup Frontend

```bash
# Go back to root directory
cd ..
npm install
```

5. Start the Application

```bash
# Terminal 1: Start Backend
cd backend
node index.js

# Terminal 2: Start Frontend
npm start
```

6. Access the Application

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:5000](http://localhost:5000)

## API Endpoints

| Method | Endpoint                      | Auth Required | Description                       |
| ------ | ----------------------------- | ------------- | --------------------------------- |
| POST   | `/api/auth/register`        | ❌            | User registration with validation |
| POST   | `/api/auth/login`           | ❌            | User login with credentials       |
| GET    | `/api/auth/user`            | ✅            | Get authenticated user profile    |
| GET    | `/api/notes/fetchallnotes`  | ✅            | Get all notes for logged-in user  |
| POST   | `/api/notes/addnote`        | ✅            | Create new note                   |
| PUT    | `/api/notes/updatenote/:id` | ✅            | Update existing note              |
| DELETE | `/api/notes/deletenote/:id` | ✅            | Delete note                       |

**Note:** Protected endpoints require `Authorization: Bearer <token>` header

## Project Structure

```
noteverse/
├── src/                    # React frontend
│   ├── components/         # React components
│   ├── context/           # State management
│   └── styles/            # CSS files
├── backend/               # Node.js backend
│   ├── routes/            # API routes
│   ├── models/            # Database models
│   └── middleware/        # Auth middleware
└── public/                # Static files
```
