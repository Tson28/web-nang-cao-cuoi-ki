# Authentication Module Documentation

## Overview

Module Authentication quản lý đăng ký, đăng nhập, xác thực JWT, phân quyền người dùng cho hệ thống Quản lý Đồ án Sinh viên.

## User Roles (Vai trò)

- **STUDENT** (Sinh viên) - Vai trò mặc định
- **LECTURER** (Giảng viên) - Giáo viên hướng dẫn
- **ADMIN** (Quản trị) - Người quản lý hệ thống

## User Model Structure

```javascript
{
  _id: ObjectId,
  fullName: String,        // Họ và tên
  email: String,           // Email duy nhất
  password: String,        // Hash bằng bcryptjs
  role: String,           // 'student' | 'lecturer' | 'admin'
  avatar: String,         // URL hình đại diện
  isActive: Boolean,      // Trạng thái kích hoạt
  createdAt: DateTime,    // Ngày tạo
  updatedAt: DateTime,    // Ngày cập nhật
}
```

## API Endpoints

### 1. Register (Đăng ký tài khoản)

**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "fullName": "Nguyễn Văn A",
  "email": "nguyenvana@example.com",
  "password": "password123",
  "role": "student",
  "avatar": "https://example.com/avatar.jpg"
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "fullName": "Nguyễn Văn A",
      "email": "nguyenvana@example.com",
      "role": "student",
      "avatar": "https://example.com/avatar.jpg",
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Response (Error - 400):**
```json
{
  "success": false,
  "message": "Validation failed",
  "data": {
    "errors": {
      "email": "This email is already in use",
      "password": "Password must be at least 6 characters"
    }
  }
}
```

**Validation Rules:**
- `fullName` - Bắt buộc, tối thiểu 2 ký tự
- `email` - Bắt buộc, định dạng email hợp lệ, duy nhất
- `password` - Bắt buộc, tối thiểu 6 ký tự
- `role` - Tùy chọn (mặc định: 'student'), phải là 'student', 'lecturer', hoặc 'admin'
- `avatar` - Tùy chọn

---

### 2. Login (Đăng nhập)

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "nguyenvana@example.com",
  "password": "password123"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "fullName": "Nguyễn Văn A",
      "email": "nguyenvana@example.com",
      "role": "student",
      "avatar": "https://example.com/avatar.jpg",
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Response (Error - 401):**
```json
{
  "success": false,
  "message": "Invalid email or password",
  "data": {}
}
```

**Response (Error - 403):**
```json
{
  "success": false,
  "message": "User account is inactive",
  "data": {}
}
```

**Validation Rules:**
- `email` - Bắt buộc, định dạng email hợp lệ
- `password` - Bắt buộc

---

### 3. Get Current User (Lấy thông tin người dùng hiện tại)

**Endpoint:** `GET /api/auth/me`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "User fetched successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "fullName": "Nguyễn Văn A",
    "email": "nguyenvana@example.com",
    "role": "student",
    "avatar": "https://example.com/avatar.jpg",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

**Response (Error - 401):**
```json
{
  "success": false,
  "message": "No token provided",
  "data": {}
}
```

---

### 4. Change Password (Đổi mật khẩu)

**Endpoint:** `PUT /api/auth/change-password`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "currentPassword": "password123",
  "newPassword": "newPassword456"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Password changed successfully",
  "data": {}
}
```

**Response (Error - 401):**
```json
{
  "success": false,
  "message": "Current password is incorrect",
  "data": {}
}
```

**Response (Error - 400):**
```json
{
  "success": false,
  "message": "Validation failed",
  "data": {
    "errors": {
      "newPassword": "New password must be different from current password"
    }
  }
}
```

**Validation Rules:**
- `currentPassword` - Bắt buộc
- `newPassword` - Bắt buộc, tối thiểu 6 ký tự, khác mật khẩu hiện tại

---

### 5. Verify Token (Xác minh token)

**Endpoint:** `GET /api/auth/verify-token`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Token is valid",
  "data": {
    "userId": "507f1f77bcf86cd799439011",
    "role": "student",
    "iat": 1705318200,
    "exp": 1705923000
  }
}
```

---

### 6. Refresh Token (Làm mới token)

**Endpoint:** `POST /api/auth/refresh-token`

**Request Body:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (Success - 200):**
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

## Authentication Flow (Luồng xác thực)

### 1. Registration Flow
```
User fills register form
    ↓
Validate input (email, password, etc.)
    ↓
Check if email already exists
    ↓
Hash password with bcryptjs
    ↓
Save user to database
    ↓
Generate JWT token
    ↓
Return user data + token
```

### 2. Login Flow
```
User enters email & password
    ↓
Validate input
    ↓
Find user by email
    ↓
Compare password (bcrypt)
    ↓
Check if user is active
    ↓
Generate JWT token
    ↓
Return user data + token
```

### 3. Protected Route Access Flow
```
Client sends request with Authorization header
    ↓
Extract token from header
    ↓
Verify JWT signature
    ↓
Decode token payload
    ↓
Attach user info to request
    ↓
Continue to route handler
```

---

## JWT Token Structure

**Token Format:** `Bearer <jwt_token>`

**JWT Payload:**
```json
{
  "userId": "507f1f77bcf86cd799439011",
  "role": "student",
  "iat": 1705318200,
  "exp": 1705923000
}
```

**Token Configuration (.env):**
```
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRE=7d
```

---

## Middleware Usage

### Middleware: verifyToken (verify JWT)

Kiểm tra token hợp lệ và gắn user info vào request.

```javascript
const { verifyToken } = require('./middlewares/auth');

router.get('/protected-route', verifyToken, (req, res) => {
  // req.user chứa: { userId, role, iat, exp }
  console.log(req.user.userId);
});
```

### Middleware: authorizeRole (phân quyền)

Chỉ cho phép truy cập nếu user có role nhất định.

```javascript
const { verifyToken, authorizeRole } = require('./middlewares/auth');

// Chỉ admin và lecturer mới có thể truy cập
router.post(
  '/admin-route',
  verifyToken,
  authorizeRole('admin', 'lecturer'),
  (req, res) => {
    // Only admin and lecturer can access
  }
);
```

---

## Security Features

### 1. Password Hashing
- Sử dụng **bcryptjs** (10 salt rounds)
- Password không được lưu dưới dạng plaintext
- Luôn hash trước khi lưu vào database

### 2. JWT Authentication
- Token có thời hạn hết hạn (mặc định 7 ngày)
- Secret key phải bảo mật trong .env
- Token được xác minh trước khi sử dụng

### 3. Input Validation
- Validate email format
- Validate password length
- Validate required fields
- Sanitize input data

### 4. Error Handling
- Không tiết lộ thông tin nhạy cảm trong error message
- Phân biệt giữa "email không tồn tại" vs "password sai"
- Ghi log lỗi cho mục đích debug

### 5. Account Security
- Kiểm tra tài khoản active/inactive
- Hỗ trợ đổi mật khẩu
- Xác minh mật khẩu hiện tại trước khi đổi

---

## Error Handling

### HTTP Status Codes

| Status | Meaning | Example |
|--------|---------|---------|
| 200 | OK | Login success |
| 201 | Created | Register success |
| 400 | Bad Request | Validation error |
| 401 | Unauthorized | Invalid token, wrong password |
| 403 | Forbidden | User inactive, insufficient role |
| 404 | Not Found | User not found |
| 500 | Server Error | Database error |

### Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "data": {
    "errors": {
      "field": "Error message"
    }
  }
}
```

---

## Testing Examples

### Register with cURL
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

### Login with cURL
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Access Protected Route with cURL
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## Best Practices

1. **Always use HTTPS** in production
2. **Keep JWT_SECRET safe** - Use environment variables
3. **Validate input** - Both client-side and server-side
4. **Hash passwords** - Never store plaintext passwords
5. **Set expiration** - Tokens should expire after some time
6. **Refresh tokens** - Implement token refresh mechanism
7. **Monitor failed logins** - Prevent brute force attacks
8. **Log authentication events** - For security audit

---

## Troubleshooting

### "No token provided"
- Kiểm tra Authorization header
- Format: `Authorization: Bearer <token>`

### "Invalid token"
- Token có thể đã hết hạn
- Secret key không khớp
- Token bị sửa đổi

### "Email already registered"
- Email đã được sử dụng
- Thử đăng nhập hoặc reset password

### "Invalid email or password"
- Kiểm tra email và password
- Chú ý đến hoa thường

---

## File Structure

```
backend/
├── src/
│   ├── controllers/
│   │   └── AuthController.js      # HTTP request handlers
│   ├── services/
│   │   └── AuthService.js         # Business logic
│   ├── models/
│   │   └── User.js                # Database schema
│   ├── middlewares/
│   │   └── auth.js                # JWT verification & authorization
│   ├── validators/
│   │   └── authValidator.js       # Input validation
│   ├── routes/
│   │   └── authRoutes.js          # API endpoints
│   └── utils/
│       └── response.js            # Response formatting
└── README_AUTH.md                 # This file
```

---

## Next Steps

1. Implement registration confirmation email
2. Add password reset functionality
3. Implement two-factor authentication (2FA)
4. Add rate limiting for login attempts
5. Create audit logs for security events
6. Implement refresh token mechanism

---

## Support

Liên hệ team phát triển để được hỗ trợ thêm.
