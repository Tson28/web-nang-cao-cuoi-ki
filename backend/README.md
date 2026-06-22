# Student Project Management System - Backend

## Overview

Backend API cho hệ thống quản lý đồ án sinh viên, được xây dựng bằng Node.js, Express.js, và MongoDB.

## Công nghệ sử dụng

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **cors** - CORS middleware
- **helmet** - Security middleware
- **morgan** - HTTP request logger
- **dotenv** - Environment variables

## Cấu trúc dự án

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/
│   │   ├── AuthController.js
│   │   ├── UserController.js
│   │   ├── ProjectController.js
│   │   ├── TaskController.js
│   │   └── SubmissionController.js
│   ├── middlewares/
│   │   ├── auth.js              # JWT authentication
│   │   └── errorHandler.js      # Error handling
│   ├── models/
│   │   ├── User.js
│   │   ├── Project.js
│   │   ├── Task.js
│   │   └── Submission.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── projectRoutes.js
│   │   ├── taskRoutes.js
│   │   └── submissionRoutes.js
│   ├── services/
│   │   ├── AuthService.js
│   │   ├── UserService.js
│   │   ├── ProjectService.js
│   │   ├── TaskService.js
│   │   └── SubmissionService.js
│   ├── utils/
│   │   ├── response.js          # Response formatter
│   │   └── constants.js         # Constants
│   ├── validators/
│   │   └── index.js             # Input validators
│   ├── app.js                   # Express app setup
│   └── server.js                # Server entry point
├── .env.example                 # Environment variables template
└── package.json
```

## Installation

### 1. Clone the repository
```bash
cd backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
```bash
cp .env.example .env
```

Chỉnh sửa `.env` file:
```
MONGODB_URI=mongodb://localhost:27017/student-project-management
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
```

### 4. Make sure MongoDB is running
```bash
# On Windows
mongod

# On macOS/Linux
mongod
```

### 5. Start the server

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Server sẽ chạy trên `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (requires auth)
- `GET /api/auth/verify-token` - Verify JWT token (requires auth)

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/lecturers` - Get all lecturers
- `GET /api/users/students` - Get all students
- `GET /api/users/:userId` - Get user by ID
- `PUT /api/users/:userId` - Update user profile
- `DELETE /api/users/:userId` - Delete user (admin only)
- `POST /api/users/:userId/change-password` - Change password

### Projects
- `POST /api/projects` - Create project (lecturers)
- `GET /api/projects` - Get all projects
- `GET /api/projects/my-projects` - Get user's projects
- `GET /api/projects/:projectId` - Get project details
- `PUT /api/projects/:projectId` - Update project
- `DELETE /api/projects/:projectId` - Delete project
- `POST /api/projects/:projectId/members` - Add project member
- `DELETE /api/projects/:projectId/members/:memberId` - Remove project member

### Tasks
- `POST /api/tasks` - Create task
- `GET /api/tasks/my-tasks` - Get user's tasks
- `GET /api/tasks/project/:projectId` - Get project tasks
- `GET /api/tasks/:taskId` - Get task details
- `PUT /api/tasks/:taskId` - Update task
- `DELETE /api/tasks/:taskId` - Delete task
- `POST /api/tasks/:taskId/assign` - Assign task to user
- `DELETE /api/tasks/:taskId/assignee/:assigneeId` - Remove assignee

### Submissions
- `POST /api/submissions` - Create submission
- `GET /api/submissions/my-submissions` - Get user's submissions
- `GET /api/submissions/project/:projectId` - Get project submissions
- `GET /api/submissions/:submissionId` - Get submission details
- `PUT /api/submissions/:submissionId` - Update submission
- `DELETE /api/submissions/:submissionId` - Delete submission
- `POST /api/submissions/:submissionId/review` - Review submission

## Response Format

Tất cả API responses tuân theo format:
```json
{
  "success": true,
  "message": "Success message",
  "data": {
    // Response data
  }
}
```

## Authentication

API sử dụng JWT (JSON Web Token) cho authentication. 

Gửi token trong header:
```
Authorization: Bearer <token>
```

## Error Handling

Server xử lý lỗi thống nhất với format:
```json
{
  "success": false,
  "message": "Error message",
  "data": {}
}
```

HTTP Status Codes:
- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## MVC Architecture

Dự án tuân theo MVC pattern:

- **Models** - Định nghĩa schema database
- **Controllers** - Xử lý HTTP requests
- **Services** - Business logic
- **Routes** - API endpoints
- **Middlewares** - Request/response processing
- **Validators** - Input validation

## Security Features

- Password hashing với bcryptjs
- JWT token authentication
- Helmet.js for HTTP headers security
- CORS protection
- Input validation
- Error handling

## Development Tips

1. Thêm environment variable vào `.env` file
2. Tạo validator mới trong `src/validators/`
3. Tạo service mới trong `src/services/`
4. Tạo controller mới trong `src/controllers/`
5. Tạo routes mới trong `src/routes/`
6. Thêm routes vào `app.js`

## Troubleshooting

### MongoDB Connection Error
- Kiểm tra MongoDB service đang chạy
- Kiểm tra MONGODB_URI trong .env file
- Kiểm tra connection string format

### JWT Token Error
- Kiểm tra JWT_SECRET được set trong .env
- Kiểm tra token format trong Authorization header
- Kiểm tra token chưa hết hạn

### CORS Error
- Kiểm tra CORS_ORIGIN trong .env file
- Kiểm tra frontend URL đúng

## License

MIT

## Support

Liên hệ với team để được hỗ trợ.
