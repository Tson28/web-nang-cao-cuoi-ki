# Authentication Module - Complete Code Summary

## 📋 Overview

Module xác thực hoàn chỉnh với JWT, bcryptjs, role-based access control cho hệ thống quản lý đồ án sinh viên.

## 📁 File Structure

```
backend/
├── src/
│   ├── models/
│   │   └── User.js                    # ✓ Updated
│   ├── controllers/
│   │   └── AuthController.js          # ✓ Updated
│   ├── services/
│   │   └── AuthService.js             # ✓ Updated
│   ├── middlewares/
│   │   └── auth.js                    # ✓ Updated
│   ├── validators/
│   │   └── authValidator.js           # ✓ Created
│   ├── routes/
│   │   └── authRoutes.js              # ✓ Updated
│   └── app.js                         # No changes needed
├── README_AUTH.md                     # ✓ Documentation
├── AUTH_EXAMPLES.js                   # ✓ Usage examples
├── AUTH_TESTS.js                      # ✓ Test cases
├── POSTMAN_COLLECTION.json            # ✓ Postman import
└── .env.example                       # Reference
```

## 🔐 User Roles

```javascript
const ROLES = {
  STUDENT: 'student',      // Default role
  LECTURER: 'lecturer',    // Instructor/Professor
  ADMIN: 'admin'           // Administrator
};
```

## 👤 User Model Schema

```javascript
{
  _id: ObjectId,
  fullName: String,           // Required: Họ tên
  email: String,              // Required: Email (unique)
  password: String,           // Required: Hashed password
  role: String,               // Enum: 'student'|'lecturer'|'admin'
  avatar: String,             // Optional: Avatar URL
  isActive: Boolean,          // Default: true
  createdAt: DateTime,        // Auto
  updatedAt: DateTime,        // Auto
}
```

## 🔌 API Endpoints

### Public Endpoints

#### 1. POST /api/auth/register
Register new user account

**Request:**
```json
{
  "fullName": "Nguyễn Văn A",
  "email": "student@example.com",
  "password": "password123",
  "role": "student",
  "avatar": "https://example.com/avatar.jpg"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "60d5ec49f1b2c72b8c8e4b1a",
      "fullName": "Nguyễn Văn A",
      "email": "student@example.com",
      "role": "student",
      "avatar": "https://example.com/avatar.jpg",
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

#### 2. POST /api/auth/login
User login

**Request:**
```json
{
  "email": "student@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### Protected Endpoints (require valid JWT token)

#### 3. GET /api/auth/me
Get current user profile

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "User fetched successfully",
  "data": {
    "_id": "60d5ec49f1b2c72b8c8e4b1a",
    "fullName": "Nguyễn Văn A",
    "email": "student@example.com",
    "role": "student",
    "avatar": "...",
    "isActive": true,
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

---

#### 4. PUT /api/auth/change-password
Change user password

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request:**
```json
{
  "currentPassword": "password123",
  "newPassword": "newPassword456"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password changed successfully",
  "data": {}
}
```

---

#### 5. GET /api/auth/verify-token
Verify JWT token validity

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Token is valid",
  "data": {
    "userId": "60d5ec49f1b2c72b8c8e4b1a",
    "role": "student",
    "iat": 1705318200,
    "exp": 1705923000
  }
}
```

---

#### 6. POST /api/auth/refresh-token
Get new JWT token

**Request:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## 🔑 Key Features

✅ **User Registration**
- Email validation
- Password hashing (bcryptjs)
- Role selection
- Duplicate email prevention

✅ **User Authentication**
- Email/password login
- JWT token generation
- Token expiration (7 days default)
- Account status checking

✅ **Password Management**
- Current password verification
- New password validation
- Secure password hashing

✅ **Token Management**
- JWT verification
- Token refresh
- Token expiration handling

✅ **Authorization**
- Role-based access control (RBAC)
- Protected routes
- Dynamic role checking

✅ **Security**
- bcryptjs password hashing (10 salt rounds)
- JWT secret in environment variables
- CORS protection
- Helmet security headers
- Input validation
- Error handling without exposing sensitive data

---

## 🛡️ Middleware

### verifyToken
Validates JWT token and attaches user info to request

```javascript
const { verifyToken } = require('./middlewares/auth');

router.get('/protected', verifyToken, (req, res) => {
  console.log(req.user); // { userId, role, iat, exp }
});
```

### authorizeRole
Restricts access based on user role

```javascript
const { verifyToken, authorizeRole } = require('./middlewares/auth');

router.post('/admin-only', 
  verifyToken, 
  authorizeRole('admin'), 
  handler
);

router.post('/lecturer-or-admin',
  verifyToken,
  authorizeRole('lecturer', 'admin'),
  handler
);
```

---

## 📚 Services (Business Logic)

### AuthService Methods

```javascript
static async register(userData)
  // Register new user
  // - Validate input
  // - Check duplicate email
  // - Hash password
  // - Create user
  // - Generate token
  // Returns: { user, token }

static async login(email, password)
  // Authenticate user
  // - Validate input
  // - Find user
  // - Verify password
  // - Check account active
  // - Generate token
  // Returns: { user, token }

static async getCurrentUser(userId)
  // Get user by ID
  // - Find user
  // - Check account active
  // Returns: user object (without password)

static async changePassword(userId, currentPassword, newPassword)
  // Change user password
  // - Validate input
  // - Find user
  // - Verify current password
  // - Hash new password
  // - Save user
  // Returns: { message }

static generateToken(userId, role)
  // Create JWT token
  // Returns: signed token

static verifyToken(token)
  // Validate JWT token
  // Returns: decoded payload or throws error

static refreshToken(token)
  // Generate new token from existing token
  // Returns: new token
```

---

## ✔️ Input Validators

### authValidator.js

```javascript
validateRegister(data)
  // - fullName: required, min 2 chars
  // - email: required, valid format
  // - password: required, min 6 chars
  // - role: optional, must be valid role

validateLogin(data)
  // - email: required, valid format
  // - password: required

validateChangePassword(data)
  // - currentPassword: required
  // - newPassword: required, min 6 chars, different from current
```

---

## 🚀 Usage Examples

### JavaScript/Fetch

```javascript
// Register
const registerResponse = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    fullName: 'Nguyễn Văn A',
    email: 'student@example.com',
    password: 'password123',
    role: 'student'
  })
});
const { data: { token } } = await registerResponse.json();
localStorage.setItem('token', token);

// Login
const loginResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'student@example.com',
    password: 'password123'
  })
});
const { data: { token } } = await loginResponse.json();

// Get current user
const meResponse = await fetch('/api/auth/me', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

// Change password
await fetch('/api/auth/change-password', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    currentPassword: 'password123',
    newPassword: 'newPassword456'
  })
});
```

### Axios

```javascript
const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Register
const { data: { data: { token } } } = await api.post('/auth/register', {
  fullName: 'Nguyễn Văn A',
  email: 'student@example.com',
  password: 'password123',
  role: 'student'
});

// Login
const loginData = await api.post('/auth/login', {
  email: 'student@example.com',
  password: 'password123'
});

// Get current user
const user = await api.get('/auth/me');
```

---

## 🧪 Testing

### cURL Examples

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Nguyễn Văn A",
    "email": "student@example.com",
    "password": "password123",
    "role": "student"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "password123"
  }'

# Get current user (replace TOKEN)
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer TOKEN"

# Change password
curl -X PUT http://localhost:5000/api/auth/change-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "currentPassword": "password123",
    "newPassword": "newPassword456"
  }'
```

### Postman
1. Import `POSTMAN_COLLECTION.json` into Postman
2. Set variables:
   - `base_url`: http://localhost:5000
   - `token`: JWT token from login response

---

## 🔄 Authentication Flow

```
1. REGISTER
   User → POST /api/auth/register
   ↓
   Validate input
   ↓
   Check duplicate email
   ↓
   Hash password (bcryptjs)
   ↓
   Save to database
   ↓
   Generate JWT token
   ↓
   Return user + token

2. LOGIN
   User → POST /api/auth/login
   ↓
   Validate input
   ↓
   Find user by email
   ↓
   Compare password (bcryptjs)
   ↓
   Check isActive
   ↓
   Generate JWT token
   ↓
   Return user + token

3. PROTECTED REQUEST
   Client → GET /api/auth/me
   ↓
   Header: Authorization: Bearer <token>
   ↓
   Middleware: Extract token
   ↓
   Verify JWT signature
   ↓
   Decode payload
   ↓
   Attach req.user
   ↓
   Continue to handler
```

---

## 🔒 Security Checklist

- ✅ Password hashing (bcryptjs)
- ✅ JWT authentication
- ✅ Token expiration
- ✅ Input validation
- ✅ Error handling (no sensitive info)
- ✅ Environment variables for secrets
- ✅ CORS protection
- ✅ Helmet security headers
- ✅ Account status checking
- ✅ Role-based access control

---

## 📝 Configuration

### .env
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/student-project-management
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
NODE_ENV=development
```

---

## 📦 Dependencies

```json
{
  "bcryptjs": "^2.4.3",
  "cors": "^2.8.5",
  "dotenv": "^16.0.3",
  "express": "^4.18.2",
  "helmet": "^7.0.0",
  "jsonwebtoken": "^9.0.0",
  "mongoose": "^7.0.3",
  "morgan": "^1.10.0"
}
```

---

## 📖 Documentation Files

1. **README_AUTH.md** - Complete API documentation
2. **AUTH_EXAMPLES.js** - Usage examples and code snippets
3. **AUTH_TESTS.js** - Test cases
4. **POSTMAN_COLLECTION.json** - Postman collection for testing

---

## 🎯 Next Steps

1. ✅ Basic authentication module completed
2. Next: Email verification
3. Next: Password reset via email
4. Next: Two-factor authentication (2FA)
5. Next: Refresh token mechanism
6. Next: Login attempt rate limiting
7. Next: Audit logging

---

## 💡 Tips

1. Always use HTTPS in production
2. Rotate JWT_SECRET periodically
3. Implement login attempt limiting
4. Add email verification
5. Set strong password requirements
6. Monitor failed login attempts
7. Use secure cookie-based tokens for web apps
8. Implement logout functionality (blacklist tokens)

---

## 🐛 Troubleshooting

### Issue: "No token provided"
- Check Authorization header format: `Bearer <token>`

### Issue: "Invalid token"
- Token might be expired
- Secret key mismatch
- Token was modified

### Issue: "Email already registered"
- Use different email or reset password

### Issue: "Invalid email or password"
- Check credentials are correct
- Email is case-insensitive but password is not

---

## 📞 Support

For issues or questions, refer to:
- README_AUTH.md
- AUTH_EXAMPLES.js
- AUTH_TESTS.js

---

**Version:** 1.0.0  
**Last Updated:** 2024-01-15  
**Status:** ✅ Production Ready
