/**
 * Authentication API Usage Examples
 * 
 * Các ví dụ sử dụng API Authentication
 */

// ============================================
// 1. REGISTER (ĐĂNG KÝ)
// ============================================

// Example 1: Register as STUDENT
fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    fullName: 'Nguyễn Văn A',
    email: 'student@example.com',
    password: 'password123',
    role: 'student',
    avatar: 'https://example.com/avatar1.jpg'
  })
})
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      console.log('Register success!');
      console.log('Token:', data.data.token);
      // Save token to localStorage
      localStorage.setItem('token', data.data.token);
    } else {
      console.error('Register failed:', data.data);
    }
  })
  .catch(error => console.error('Error:', error));

// Example 2: Register as LECTURER
fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    fullName: 'Trần Thị B',
    email: 'lecturer@example.com',
    password: 'password123',
    role: 'lecturer',
  })
})
  .then(res => res.json())
  .then(data => console.log(data));

// Example 3: Register as ADMIN
fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    fullName: 'Lê Văn C',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin',
  })
})
  .then(res => res.json())
  .then(data => console.log(data));

// ============================================
// 2. LOGIN (ĐĂNG NHẬP)
// ============================================

function login(email, password) {
  return fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email,
      password: password,
    })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        // Save token to localStorage
        localStorage.setItem('token', data.data.token);
        console.log('Login success!');
        return data.data;
      } else {
        throw new Error(data.message);
      }
    });
}

// Usage:
login('student@example.com', 'password123')
  .then(user => {
    console.log('Current user:', user);
  })
  .catch(error => console.error('Login error:', error));

// ============================================
// 3. GET CURRENT USER (LẤY THÔNG TIN NGƯỜI DÙNG)
// ============================================

function getCurrentUser() {
  const token = localStorage.getItem('token');
  
  return fetch('http://localhost:5000/api/auth/me', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        console.log('User data:', data.data);
        return data.data;
      } else {
        throw new Error(data.message);
      }
    });
}

// Usage:
getCurrentUser()
  .then(user => {
    console.log('Full name:', user.fullName);
    console.log('Email:', user.email);
    console.log('Role:', user.role);
  })
  .catch(error => console.error('Error:', error));

// ============================================
// 4. CHANGE PASSWORD (ĐỔI MẬT KHẨU)
// ============================================

function changePassword(currentPassword, newPassword) {
  const token = localStorage.getItem('token');
  
  return fetch('http://localhost:5000/api/auth/change-password', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      currentPassword: currentPassword,
      newPassword: newPassword,
    })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        console.log('Password changed successfully!');
        return data;
      } else {
        throw new Error(data.message);
      }
    });
}

// Usage:
changePassword('password123', 'newPassword456')
  .then(result => console.log(result.message))
  .catch(error => console.error('Error:', error));

// ============================================
// 5. VERIFY TOKEN (KIỂM TRA TOKEN)
// ============================================

function verifyToken() {
  const token = localStorage.getItem('token');
  
  if (!token) {
    console.error('No token found');
    return;
  }

  return fetch('http://localhost:5000/api/auth/verify-token', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        console.log('Token is valid');
        console.log('Token info:', data.data);
        return true;
      } else {
        console.log('Token is invalid');
        return false;
      }
    });
}

// Usage:
verifyToken();

// ============================================
// 6. REFRESH TOKEN (LÀM MỚI TOKEN)
// ============================================

function refreshToken() {
  const token = localStorage.getItem('token');
  
  return fetch('http://localhost:5000/api/auth/refresh-token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token: token
    })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        // Save new token
        localStorage.setItem('token', data.data.token);
        console.log('Token refreshed successfully!');
        return data.data.token;
      } else {
        throw new Error(data.message);
      }
    });
}

// Usage:
refreshToken()
  .then(newToken => console.log('New token:', newToken))
  .catch(error => console.error('Error:', error));

// ============================================
// 7. LOGOUT (ĐĂNG XUẤT)
// ============================================

function logout() {
  // Remove token from localStorage
  localStorage.removeItem('token');
  console.log('Logged out successfully');
  // Redirect to login page
  // window.location.href = '/login';
}

// ============================================
// 8. AUTH HELPER FUNCTIONS
// ============================================

class AuthHelper {
  static getToken() {
    return localStorage.getItem('token');
  }

  static setToken(token) {
    localStorage.setItem('token', token);
  }

  static removeToken() {
    localStorage.removeItem('token');
  }

  static hasToken() {
    return !!this.getToken();
  }

  static getAuthHeader() {
    const token = this.getToken();
    return {
      'Authorization': `Bearer ${token}`
    };
  }

  static isLoggedIn() {
    return this.hasToken();
  }
}

// Usage:
console.log(AuthHelper.isLoggedIn());
const headers = AuthHelper.getAuthHeader();
// Use headers in fetch requests

// ============================================
// 9. MAKE AUTHENTICATED REQUEST
// ============================================

function makeAuthenticatedRequest(url, options = {}) {
  const token = localStorage.getItem('token');
  
  if (!token) {
    console.error('No token found. Please login first.');
    return Promise.reject(new Error('Not authenticated'));
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers
  };

  return fetch(url, {
    ...options,
    headers
  })
    .then(res => res.json())
    .then(data => {
      if (res.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('token');
        // Redirect to login
        throw new Error('Token expired. Please login again.');
      }
      return data;
    });
}

// Usage:
makeAuthenticatedRequest('http://localhost:5000/api/auth/me')
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));

// ============================================
// 10. AXIOS EXAMPLE (if using axios)
// ============================================

// Installation: npm install axios

const axios = require('axios');

// Create axios instance with auth
const authAPI = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Add token to every request
authAPI.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Handle 401 responses
authAPI.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Usage with axios:
authAPI.post('/auth/login', {
  email: 'student@example.com',
  password: 'password123'
})
  .then(res => {
    localStorage.setItem('token', res.data.data.token);
    console.log('Login success!');
  })
  .catch(error => console.error('Login error:', error));

// Get current user with axios:
authAPI.get('/auth/me')
  .then(res => console.log('User:', res.data.data))
  .catch(error => console.error('Error:', error));

// ============================================
// 11. ERROR HANDLING
// ============================================

async function handleAuthError(error) {
  if (error.response) {
    const status = error.response.status;
    const message = error.response.data?.message;

    switch (status) {
      case 400:
        console.error('Validation error:', error.response.data?.data?.errors);
        break;
      case 401:
        console.error('Unauthorized:', message);
        localStorage.removeItem('token');
        // Redirect to login
        break;
      case 403:
        console.error('Forbidden:', message);
        break;
      case 404:
        console.error('Not found:', message);
        break;
      default:
        console.error('Error:', message);
    }
  } else {
    console.error('Request error:', error.message);
  }
}

// ============================================
// 12. REACT HOOK EXAMPLE
// ============================================

/*
import { useState, useContext, createContext } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const login = async (email, password) => {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    
    if (data.success) {
      setToken(data.data.token);
      setUser(data.data.user);
      localStorage.setItem('token', data.data.token);
    }
    return data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
*/

// ============================================
// 13. TESTING WITH CURL
// ============================================

/*
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "student"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Get Current User (replace TOKEN with actual token)
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer TOKEN"

# Change Password
curl -X PUT http://localhost:5000/api/auth/change-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "currentPassword": "password123",
    "newPassword": "newPassword456"
  }'

# Verify Token
curl -X GET http://localhost:5000/api/auth/verify-token \
  -H "Authorization: Bearer TOKEN"

# Refresh Token
curl -X POST http://localhost:5000/api/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d '{
    "token": "TOKEN"
  }'
*/

module.exports = {
  login,
  getCurrentUser,
  changePassword,
  verifyToken,
  refreshToken,
  logout,
  AuthHelper,
  makeAuthenticatedRequest
};
