# NoteVerse Frontend Documentation

## 📁 Folder Structure

```
src/
├── index.js              # React app entry point
├── App.js                # Main app component with routing
├── App.css               # Global app styles
├── index.css             # Base styles
├── components/
│   ├── About.js          # About page component
│   ├── AddNote.js        # Add new note form
│   ├── Alert.js          # Alert/notification component
│   ├── Home.js           # Home page with notes
│   ├── Login.js          # Login form component
│   ├── Navbar.js         # Navigation bar
│   ├── NoteItem.js       # Individual note card
│   ├── Notes.js          # Notes list container
│   ├── ProtectedRoute.js # Route protection wrapper
│   ├── Signup.js         # Registration form
│   └── COMPONENTS.md     # Components documentation
├── context/
│   ├── auth/
│   │   ├── authContext.js    # Auth context definition
│   │   └── AuthState.js      # Auth state provider
│   └── notes/
│       ├── noteContext.js    # Notes context definition
│       └── NoteState.js      # Notes state provider
└── styles/
    └── Notes.css         # Notes-specific styling
```

## 🗃️ What Each File Does

### **Core Files**

**`index.js`** - React app entry point. Renders App component into DOM root, sets up React 18 with createRoot

**`App.js`** - Main application component. Sets up React Router, wraps app in AuthState & NoteState providers, defines all routes, manages global alert state

**`App.css`** - Global application styles and CSS variables

**`index.css`** - Base CSS reset and fundamental styling

### **Components**

**`Navbar.js`** - Navigation component. Shows login/signup links for guests, user name and logout for authenticated users, responsive design

**`Home.js`** - Main dashboard page. Container for AddNote and Notes components, protected route that requires authentication

**`About.js`** - Static about page component with app information

**`Login.js`** - User login form. Handles email/password input, form validation, calls AuthState login, redirects on success with useEffect

**`Signup.js`** - User registration form. Handles name/email/password input, validation, calls AuthState register, redirects on success

**`ProtectedRoute.js`** - Route protection wrapper. Checks authentication status, shows loading spinner, redirects to login if not authenticated

**`Alert.js`** - Global notification component. Displays success/error messages with Bootstrap styling, supports line breaks with whiteSpace: pre-line

**`AddNote.js`** - Add new note form. Controlled form inputs for title/description/tag, calls NoteState addNote, resets form after submission

**`Notes.js`** - Notes list container. Fetches and displays all user notes using NoteState, handles loading states

**`NoteItem.js`** - Individual note card. Shows note details, handles edit/delete actions, supports inline editing with preview mode

### **Context (State Management)**

**`authContext.js`** - Auth context definition. Creates React context for authentication state

**`AuthState.js`** - Auth state provider. Manages user authentication, token storage, login/register/logout functions, user data fetching

**`noteContext.js`** - Notes context definition. Creates React context for notes state

**`NoteState.js`** - Notes state provider. Manages notes CRUD operations, gets token from AuthContext, handles API calls to backend

### **Styles**

**`Notes.css`** - Component-specific styles for notes display and interactions

### **Component Hierarchy**

```
App
├── Navbar (always visible)
├── Alert (global notifications)
└── Routes
    ├── / → Redirect to /signup
    ├── /signup → Signup component
    ├── /login → Login component
    ├── /about → About component
    └── /home → ProtectedRoute
        └── Home
            ├── AddNote
            └── Notes
                └── NoteItem (multiple)
```

## 📱 Routes

| Route       | Component | Protection | Purpose            |
| ----------- | --------- | ---------- | ------------------ |
| `/`       | Navigate  | ❌         | Redirect to signup |
| `/signup` | Signup    | ❌         | User registration  |
| `/login`  | Login     | ❌         | User login         |
| `/about`  | About     | ❌         | App information    |
| `/home`   | Home      | ✅         | Main dashboard     |
