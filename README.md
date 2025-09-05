# React.js & Node.js Login/Logout Authentication System

## 🚀 Features

- **User Registration**: Create account with email and password
- **Secure Login**: Session-based authentication with httpOnly cookies  
- **Password Security**: Bcrypt password hashing
- **Session Management**: Stay logged in until logout
- **Protected Routes**: Dashboard accessible only when authenticated
- **Modern UI**: Beautiful, responsive design with animations
- **SQLite Database**: Lightweight, file-based database
- **Input Validation**: Email format validation and duplicate prevention
- **Error Handling**: User-friendly error messages

## 🛠 Tech Stack

### Backend
- **Node.js** + **Express.js** - Server framework
- **SQLite3** - Lightweight database
- **bcrypt** - Password hashing
- **express-session** - Session management
- **cookie-parser** - Cookie handling
- **cors** - Cross-origin requests
- **dotenv** - Environment variables

### Frontend  
- **React.js 18** - UI framework
- **React Router** - Client-side routing
- **Axios** - HTTP requests
- **Modern CSS** - Animated, responsive design

## 📂 Project Structure

```
project-root/
├── backend/
│   ├── server.js          # Main server file
│   ├── db.js             # Database connection & schema
│   ├── routes/
│   │   └── auth.js       # Authentication routes
│   ├── data/
│   │   └── users.db      # SQLite database (auto-created)
│   ├── .env              # Environment variables
│   └── package.json      # Backend dependencies
│
├── frontend/
│   ├── src/
│   │   ├── App.js        # Main React component
│   │   ├── App.css       # Styles & animations
│   │   └── components/
│   │       ├── Login.js     # Login form
│   │       ├── Register.js  # Registration form
│   │       └── Dashboard.js # Protected dashboard
│   ├── .env              # Frontend environment
│   └── package.json      # Frontend dependencies
│
└── README.md
```

## ⚙️ Setup & Installation

### Prerequisites
- Node.js 18+ and npm 9+
- Git

### 1. Clone Repository
```bash
git clone <repository-url>
cd project-2
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file:
```bash
SESSION_SECRET=your-super-secure-secret-key-here
CLIENT_ORIGIN=http://localhost:3000
PORT=5000
```

### 3. Frontend Setup  
```bash
cd frontend
npm install
```

## 🚀 Running the Application

### Start Backend Server
```bash
cd backend
npm start
# Server runs on http://localhost:5000
```

### Start Frontend Development Server
```bash
cd frontend  
npm start
# React app runs on http://localhost:3000
```

### Access Application
- Open browser to: `http://localhost:3000`
- Backend API: `http://localhost:5000`

## 📡 API Endpoints

### Authentication Routes (`/auth`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Create new user account |
| POST | `/auth/login` | Login with credentials |  
| POST | `/auth/logout` | Logout & clear session |
| GET | `/auth/me` | Get current user info |

### Protected Routes  
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard` | Protected dashboard data |
| GET | `/health` | Server health check |

## 💾 Database Schema

### Users Table
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL, 
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 🔐 Security Features

- **Password Hashing**: Uses bcrypt with salt rounds of 10
- **Session Security**: httpOnly cookies prevent XSS attacks
- **CORS Protection**: Configured for frontend origin only
- **Input Validation**: Email format and required field validation
- **Duplicate Prevention**: Unique email constraint in database
- **SQL Injection Prevention**: Parameterized queries

## 🎨 UI Features

- **Modern Dark Theme**: GitHub-inspired design
- **Responsive Design**: Works on desktop and mobile
- **Smooth Animations**: Loading states, transitions, hover effects
- **Form Validation**: Real-time validation with error messages
- **Password Strength**: Visual password strength indicator
- **Accessibility**: Proper labels, focus states, keyboard navigation

## 🧪 Testing the Application

### Manual Testing Flow
1. **Register**: Create account with email/password
2. **Login**: Sign in with registered credentials  
3. **Session Persistence**: Refresh page, should stay logged in
4. **Protected Route**: Access dashboard when authenticated
5. **Logout**: Sign out, session cleared, redirected to login

### API Testing (Optional)
```bash
# Health check
curl http://localhost:5000/health

# Register user
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'

# Login
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}' \
  -c cookies.txt

# Check session  
curl -X GET http://localhost:5000/auth/me -b cookies.txt
```

## 🚀 Deployment

### Backend (Render/Railway/Heroku)
1. Set environment variables:
   - `SESSION_SECRET` - Strong secret key
   - `CLIENT_ORIGIN` - Frontend URL
   - `PORT` - Provided by platform
2. Database persists in SQLite file

### Frontend (Vercel/Netlify)
1. Update API URLs if needed
2. Build with: `npm run build`
3. Deploy `build/` directory

## 📋 Assignment Requirements Checklist

### ✅ Core Requirements
- ✅ **Register (Sign Up)**: User creates account with email & password
- ✅ **Login**: Authenticate with stored credentials  
- ✅ **Session**: Stay logged in via cookies/sessions
- ✅ **Logout**: Clear session and redirect
- ✅ **Protected Route**: Dashboard accessible only when logged in

### ✅ Technical Requirements  
- ✅ **React.js Frontend**: Modern React 18 with hooks
- ✅ **Node.js Backend**: Express.js API routes
- ✅ **SQLite Database**: File-based database with proper schema
- ✅ **Password Hashing**: bcrypt with salt rounds
- ✅ **Input Validation**: Email validation, duplicate prevention
- ✅ **Error Handling**: User-friendly error messages
- ✅ **Session Management**: httpOnly cookies for security

### ✅ Deliverables
- ✅ **Source Code**: Complete, working application
- ✅ **GitHub Repository**: Clean commit history  
- ✅ **README**: Detailed setup and run instructions
- ✅ **Database Schema**: Auto-created SQLite database
- ✅ **Modern UI**: Professional, responsive design

## 🔧 Troubleshooting

### Common Issues
1. **CORS Errors**: Ensure backend CORS origin matches frontend URL
2. **Session Not Persisting**: Check cookie settings and HTTPS/HTTP
3. **Database Errors**: Ensure `backend/data/` directory is writable
4. **Port Conflicts**: Change PORT in .env if 5000 is occupied

### Development Tips
- Use browser DevTools to inspect cookies and network requests
- Check backend console for error logs
- SQLite database file is created automatically in `backend/data/`

## 📄 License

This project is for educational purposes as part of the Klickks assignment.

---

**Developed with ❤️ using React.js & Node.js**