student-project-management/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js
│   │   │   ├── cloudinary.js
│   │   │   └── mail.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── user.controller.js
│   │   │   ├── project.controller.js
│   │   │   ├── submission.controller.js
│   │   │   └── statistics.controller.js
│   │   │
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js
│   │   │   ├── role.middleware.js
│   │   │   ├── upload.middleware.js
│   │   │   ├── error.middleware.js
│   │   │   └── validate.middleware.js
│   │   │
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Project.js
│   │   │   ├── Submission.js
│   │   │   ├── Notification.js
│   │   │   └── Comment.js
│   │   │
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── user.routes.js
│   │   │   ├── project.routes.js
│   │   │   ├── submission.routes.js
│   │   │   └── statistics.routes.js
│   │   │
│   │   ├── services/
│   │   │   ├── auth.service.js
│   │   │   ├── project.service.js
│   │   │   ├── submission.service.js
│   │   │   ├── email.service.js
│   │   │   └── notification.service.js
│   │   │
│   │   ├── sockets/
│   │   │   └── socket.js
│   │   │
│   │   ├── utils/
│   │   │   ├── jwt.js
│   │   │   ├── response.js
│   │   │   ├── pagination.js
│   │   │   └── generateCode.js
│   │   │
│   │   ├── validators/
│   │   │   ├── auth.validator.js
│   │   │   ├── project.validator.js
│   │   │   └── user.validator.js
│   │   │
│   │   ├── uploads/
│   │   │   └── pdf/
│   │   │
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── public/
│   │   ├── favicon.ico
│   │   └── index.html
│   │
│   ├── src/
│   │   ├── api/
│   │   │   ├── axiosClient.js
│   │   │   ├── authApi.js
│   │   │   ├── projectApi.js
│   │   │   ├── userApi.js
│   │   │   └── submissionApi.js
│   │   │
│   │   ├── assets/
│   │   │   ├── images/
│   │   │   ├── icons/
│   │   │   └── styles/
│   │   │
│   │   ├── components/
│   │   │   ├── common/
│   │   │   ├── forms/
│   │   │   ├── tables/
│   │   │   ├── charts/
│   │   │   └── layouts/
│   │   │
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx
│   │   │
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── usePagination.js
│   │   │   └── useSocket.js
│   │   │
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Register.jsx
│   │   │   │
│   │   │   ├── admin/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── Users.jsx
│   │   │   │   └── Projects.jsx
│   │   │   │
│   │   │   ├── lecturer/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   └── ReviewSubmission.jsx
│   │   │   │
│   │   │   ├── student/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── MyProject.jsx
│   │   │   │   └── UploadReport.jsx
│   │   │   │
│   │   │   └── NotFound.jsx
│   │   │
│   │   ├── routes/
│   │   │   ├── AppRoutes.jsx
│   │   │   ├── PrivateRoute.jsx
│   │   │   └── RoleRoute.jsx
│   │   │
│   │   ├── services/
│   │   │   ├── authService.js
│   │   │   └── socketService.js
│   │   │
│   │   ├── store/
│   │   │   ├── index.js
│   │   │   └── slices/
│   │   │
│   │   ├── utils/
│   │   │   ├── constants.js
│   │   │   ├── helpers.js
│   │   │   └── formatDate.js
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── .env
│   ├── package.json
│   └── vite.config.js
│
├── docs/
│   ├── ERD.png
│   ├── UseCase.png
│   ├── SequenceDiagram.png
│   └── API_Documentation.md
│
├── docker/
│   ├── backend.Dockerfile
│   ├── frontend.Dockerfile
│   └── docker-compose.yml
│
├── README.md
<<<<<<< HEAD
└── .gitignore
=======
└── .gitignore
>>>>>>> 020feaadeb5fda7bb4ec5e750bd782f21febc221
