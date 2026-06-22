# Authentication Module - Quick Start Guide

## ⚡ Quick Setup (5 minutes)

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
```bash
# Copy .env.example to .env
cp .env.example .env

# Update .env with:
MONGODB_URI=mongodb://localhost:27017/student-project-management
PORT=5000
NODE_ENV=development
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
```

### 3. Make Sure MongoDB is Running
```bash
# Start MongoDB
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGODB_URI in .env
```

### 4. Start the Server
```bash
# Development with auto-reload
npm run dev

# OR Production
npm start

# Server should be running on http://localhost:5000
```

---

## 🧪 Quick Test

### Using cURL (Command Line)

#### 1. Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Nguyễn Văn A",
    "email": "test@example.com",
    "password": "password123",
    "role": "student"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "...",
      "fullName": "Nguyễn Văn A",
      "email": "test@example.com",
      "role": "student",
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### 2. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

#### 3. Get Current User (replace TOKEN)
```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

#### 4. Change Password
```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X PUT http://localhost:5000/api/auth/change-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "currentPassword": "password123",
    "newPassword": "newPassword456"
  }'
```

---

### Using Postman

1. **Import Collection**
   - Open Postman
   - Click "Import"
   - Select `POSTMAN_COLLECTION.json`
   - Click "Import"

2. **Set Variables**
   - Click "Environment" tab
   - Set `base_url` = `http://localhost:5000`
   - Set `token` = (after login, copy token from response)

3. **Run Requests**
   - Click on each request
   - Click "Send"
   - Check response

---

### Using JavaScript/Browser Console

```javascript
// 1. REGISTER
fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    fullName: 'Nguyễn Văn A',
    email: 'test@example.com',
    password: 'password123',
    role: 'student'
  })
})
  .then(res => res.json())
  .then(data => {
    console.log('Register Response:', data);
    // Save token for next requests
    window.token = data.data.token;
  });

// 2. LOGIN
fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'password123'
  })
})
  .then(res => res.json())
  .then(data => {
    console.log('Login Response:', data);
    window.token = data.data.token;
  });

// 3. GET CURRENT USER
fetch('http://localhost:5000/api/auth/me', {
  headers: { 'Authorization': `Bearer ${window.token}` }
})
  .then(res => res.json())
  .then(data => console.log('Current User:', data));

// 4. CHANGE PASSWORD
fetch('http://localhost:5000/api/auth/change-password', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${window.token}`
  },
  body: JSON.stringify({
    currentPassword: 'password123',
    newPassword: 'newPassword456'
  })
})
  .then(res => res.json())
  .then(data => console.log('Response:', data));
```

---

## 📚 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | User login |
| GET | `/api/auth/me` | ✅ | Get current user |
| PUT | `/api/auth/change-password` | ✅ | Change password |
| GET | `/api/auth/verify-token` | ✅ | Verify token |
| POST | `/api/auth/refresh-token` | ❌ | Get new token |

---

## 🎯 Common Use Cases

### Use Case 1: Student Registration Flow

```javascript
async function studentRegistration() {
  // 1. Register
  const registerRes = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: 'Nguyễn Văn A',
      email: 'student@example.com',
      password: 'password123',
      role: 'student',
      avatar: 'https://example.com/avatar.jpg'
    })
  });
  
  const registerData = await registerRes.json();
  
  if (registerData.success) {
    // Save token
    localStorage.setItem('token', registerData.data.token);
    console.log('Registration successful!');
    
    // Redirect to dashboard
    window.location.href = '/dashboard';
  } else {
    console.error('Registration failed:', registerData.data);
  }
}
```

### Use Case 2: Login and Get User Info

```javascript
async function loginAndGetUser() {
  // 1. Login
  const loginRes = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'student@example.com',
      password: 'password123'
    })
  });
  
  const loginData = await loginRes.json();
  
  if (loginData.success) {
    const token = loginData.data.token;
    localStorage.setItem('token', token);
    
    // 2. Get current user
    const userRes = await fetch('/api/auth/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const userData = await userRes.json();
    console.log('Current user:', userData.data);
  }
}
```

### Use Case 3: Protected API Call with Auto-Refresh

```javascript
async function makeAuthenticatedRequest(url, options = {}) {
  let token = localStorage.getItem('token');
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      ...options.headers
    }
  });
  
  // If token expired, try to refresh
  if (response.status === 401) {
    const refreshRes = await fetch('/api/auth/refresh-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    });
    
    const refreshData = await refreshRes.json();
    
    if (refreshData.success) {
      // Save new token and retry
      token = refreshData.data.token;
      localStorage.setItem('token', token);
      
      return fetch(url, {
        ...options,
        headers: {
          'Authorization': `Bearer ${token}`,
          ...options.headers
        }
      });
    } else {
      // Refresh failed, redirect to login
      window.location.href = '/login';
    }
  }
  
  return response;
}

// Usage
const res = await makeAuthenticatedRequest('/api/projects');
const data = await res.json();
```

---

## 🔑 User Roles Examples

### Creating Users with Different Roles

```bash
# Student
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Sinh viên",
    "email": "student@example.com",
    "password": "password123",
    "role": "student"
  }'

# Lecturer
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Giảng viên",
    "email": "lecturer@example.com",
    "password": "password123",
    "role": "lecturer"
  }'

# Admin
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Quản trị viên",
    "email": "admin@example.com",
    "password": "password123",
    "role": "admin"
  }'
```

---

## 🐛 Troubleshooting

### Problem: "MongoDB connection failed"
**Solution:**
```bash
# Make sure MongoDB is running
mongod

# Or check MONGODB_URI in .env
MONGODB_URI=mongodb://localhost:27017/student-project-management
```

### Problem: "Cannot find module 'bcryptjs'"
**Solution:**
```bash
npm install
```

### Problem: "No token provided"
**Solution:**
- Check Authorization header format: `Authorization: Bearer <token>`
- Make sure you saved the token from login/register response

### Problem: "Invalid token"
**Solution:**
- Token might be expired (7 days by default)
- Try to refresh token or login again
- Check JWT_SECRET in .env matches

### Problem: "Email already registered"
**Solution:**
- Use a different email or login with existing account
- Delete user from database if testing: `db.users.deleteOne({ email: 'test@example.com' })`

---

## 📖 Documentation Files

Read these files for more details:

1. **README_AUTH.md** - Complete API documentation
2. **AUTHENTICATION_MODULE.md** - Module overview
3. **AUTH_CODE_EXPORT.md** - All source code
4. **AUTH_EXAMPLES.js** - Code examples
5. **AUTH_TESTS.js** - Test cases

---

## ✅ Checklist

After setup, verify:

- [ ] MongoDB is running and connected
- [ ] Server starts without errors
- [ ] Can register new user
- [ ] Token is returned after registration
- [ ] Can login with registered credentials
- [ ] Can access `/api/auth/me` with token
- [ ] Can change password
- [ ] Invalid credentials return proper errors

---

## 🚀 Next: Create Frontend

After backend is working, create frontend to:

1. Build registration page
2. Build login page
3. Build dashboard with user info
4. Build profile edit page
5. Build change password form
6. Implement token management in frontend

---

## 💡 Tips

1. **Save Token:**
   ```javascript
   localStorage.setItem('token', response.data.token);
   ```

2. **Get Token:**
   ```javascript
   const token = localStorage.getItem('token');
   ```

3. **Remove Token (Logout):**
   ```javascript
   localStorage.removeItem('token');
   ```

4. **Check if Logged In:**
   ```javascript
   const isLoggedIn = !!localStorage.getItem('token');
   ```

5. **Add Token to Headers:**
   ```javascript
   headers: {
     'Authorization': `Bearer ${token}`
   }
   ```

---

## 📞 Need Help?

- Check error messages carefully
- Look at server logs
- Test with cURL first, then JavaScript
- Use Postman for easier testing
- Read documentation files

---

**Happy coding! 🎉**
