/**
 * Authentication API Tests
 * 
 * Các test cases cho API Authentication
 * Có thể chạy với Postman, Insomnia, hoặc các HTTP client khác
 */

// ============================================
// TEST CONFIGURATION
// ============================================

const BASE_URL = 'http://localhost:5000/api/auth';
let authToken = null;
let currentUser = null;

// ============================================
// 1. REGISTER TESTS
// ============================================

/**
 * Test 1.1: Register new student (Success)
 */
console.log('\n=== Test 1.1: Register new student ===');
fetch(`${BASE_URL}/register`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    fullName: 'Nguyễn Văn A',
    email: `student_${Date.now()}@example.com`,
    password: 'password123',
    role: 'student'
  })
})
  .then(res => res.json())
  .then(data => {
    console.log('Status:', data.success ? '✓ PASS' : '✗ FAIL');
    console.log('Message:', data.message);
    if (data.success) {
      authToken = data.data.token;
      currentUser = data.data.user;
      console.log('Token received:', authToken.substring(0, 20) + '...');
    }
  });

/**
 * Test 1.2: Register with invalid email (Error)
 */
console.log('\n=== Test 1.2: Register with invalid email ===');
fetch(`${BASE_URL}/register`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    fullName: 'Test User',
    email: 'invalid-email',
    password: 'password123'
  })
})
  .then(res => res.json())
  .then(data => {
    console.log('Status:', !data.success ? '✓ PASS' : '✗ FAIL');
    console.log('Error:', data.data?.errors?.email);
  });

/**
 * Test 1.3: Register with short password (Error)
 */
console.log('\n=== Test 1.3: Register with short password ===');
fetch(`${BASE_URL}/register`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    fullName: 'Test User',
    email: `test_${Date.now()}@example.com`,
    password: '123'  // Too short
  })
})
  .then(res => res.json())
  .then(data => {
    console.log('Status:', !data.success ? '✓ PASS' : '✗ FAIL');
    console.log('Error:', data.data?.errors?.password);
  });

/**
 * Test 1.4: Register as lecturer
 */
console.log('\n=== Test 1.4: Register as lecturer ===');
fetch(`${BASE_URL}/register`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    fullName: 'Trần Thị B',
    email: `lecturer_${Date.now()}@example.com`,
    password: 'password123',
    role: 'lecturer'
  })
})
  .then(res => res.json())
  .then(data => {
    console.log('Status:', data.success ? '✓ PASS' : '✗ FAIL');
    console.log('Role:', data.data?.user?.role);
  });

/**
 * Test 1.5: Register as admin
 */
console.log('\n=== Test 1.5: Register as admin ===');
fetch(`${BASE_URL}/register`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    fullName: 'Lê Văn C',
    email: `admin_${Date.now()}@example.com`,
    password: 'password123',
    role: 'admin'
  })
})
  .then(res => res.json())
  .then(data => {
    console.log('Status:', data.success ? '✓ PASS' : '✗ FAIL');
    console.log('Role:', data.data?.user?.role);
  });

/**
 * Test 1.6: Register with duplicate email (Error)
 */
console.log('\n=== Test 1.6: Register with duplicate email ===');
const duplicateEmail = `duplicate_${Date.now()}@example.com`;
fetch(`${BASE_URL}/register`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    fullName: 'First User',
    email: duplicateEmail,
    password: 'password123'
  })
})
  .then(res => res.json())
  .then(data => {
    // Then try to register again with same email
    if (data.success) {
      setTimeout(() => {
        fetch(`${BASE_URL}/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullName: 'Second User',
            email: duplicateEmail,
            password: 'password123'
          })
        })
          .then(res => res.json())
          .then(data => {
            console.log('Status:', !data.success ? '✓ PASS' : '✗ FAIL');
            console.log('Error:', data.message);
          });
      }, 500);
    }
  });

// ============================================
// 2. LOGIN TESTS
// ============================================

/**
 * Test 2.1: Login with correct credentials (Success)
 */
console.log('\n=== Test 2.1: Login with correct credentials ===');
const testEmail = `login_test_${Date.now()}@example.com`;
const testPassword = 'password123';

// First register
fetch(`${BASE_URL}/register`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    fullName: 'Login Test User',
    email: testEmail,
    password: testPassword
  })
})
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      // Then login
      setTimeout(() => {
        fetch(`${BASE_URL}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: testEmail,
            password: testPassword
          })
        })
          .then(res => res.json())
          .then(data => {
            console.log('Status:', data.success ? '✓ PASS' : '✗ FAIL');
            console.log('Message:', data.message);
            if (data.success) {
              authToken = data.data.token;
              console.log('Token received:', authToken.substring(0, 20) + '...');
            }
          });
      }, 500);
    }
  });

/**
 * Test 2.2: Login with wrong password (Error)
 */
console.log('\n=== Test 2.2: Login with wrong password ===');
fetch(`${BASE_URL}/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: testEmail,
    password: 'wrongpassword'
  })
})
  .then(res => res.json())
  .then(data => {
    console.log('Status:', !data.success ? '✓ PASS' : '✗ FAIL');
    console.log('Error:', data.message);
  });

/**
 * Test 2.3: Login with non-existent email (Error)
 */
console.log('\n=== Test 2.3: Login with non-existent email ===');
fetch(`${BASE_URL}/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'nonexistent@example.com',
    password: 'password123'
  })
})
  .then(res => res.json())
  .then(data => {
    console.log('Status:', !data.success ? '✓ PASS' : '✗ FAIL');
    console.log('Error:', data.message);
  });

/**
 * Test 2.4: Login without email (Error)
 */
console.log('\n=== Test 2.4: Login without email ===');
fetch(`${BASE_URL}/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    password: 'password123'
  })
})
  .then(res => res.json())
  .then(data => {
    console.log('Status:', !data.success ? '✓ PASS' : '✗ FAIL');
    console.log('Error:', data.data?.errors?.email || data.message);
  });

// ============================================
// 3. GET CURRENT USER TESTS
// ============================================

/**
 * Test 3.1: Get current user with valid token (Success)
 */
console.log('\n=== Test 3.1: Get current user with valid token ===');
setTimeout(() => {
  if (authToken) {
    fetch(`${BASE_URL}/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log('Status:', data.success ? '✓ PASS' : '✗ FAIL');
        console.log('User:', data.data?.email);
      });
  }
}, 1000);

/**
 * Test 3.2: Get current user without token (Error)
 */
console.log('\n=== Test 3.2: Get current user without token ===');
fetch(`${BASE_URL}/me`, {
  method: 'GET'
})
  .then(res => res.json())
  .then(data => {
    console.log('Status:', !data.success ? '✓ PASS' : '✗ FAIL');
    console.log('Error:', data.message);
  });

/**
 * Test 3.3: Get current user with invalid token (Error)
 */
console.log('\n=== Test 3.3: Get current user with invalid token ===');
fetch(`${BASE_URL}/me`, {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer invalid.token.here'
  }
})
  .then(res => res.json())
  .then(data => {
    console.log('Status:', !data.success ? '✓ PASS' : '✗ FAIL');
    console.log('Error:', data.message);
  });

// ============================================
// 4. CHANGE PASSWORD TESTS
// ============================================

/**
 * Test 4.1: Change password with correct current password (Success)
 */
console.log('\n=== Test 4.1: Change password ===');
setTimeout(() => {
  if (authToken) {
    fetch(`${BASE_URL}/change-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        currentPassword: testPassword,
        newPassword: 'newPassword456'
      })
    })
      .then(res => res.json())
      .then(data => {
        console.log('Status:', data.success ? '✓ PASS' : '✗ FAIL');
        console.log('Message:', data.message);
      });
  }
}, 2000);

/**
 * Test 4.2: Change password with wrong current password (Error)
 */
console.log('\n=== Test 4.2: Change password with wrong current ===');
setTimeout(() => {
  if (authToken) {
    fetch(`${BASE_URL}/change-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        currentPassword: 'wrongPassword',
        newPassword: 'newPassword456'
      })
    })
      .then(res => res.json())
      .then(data => {
        console.log('Status:', !data.success ? '✓ PASS' : '✗ FAIL');
        console.log('Error:', data.message);
      });
  }
}, 2500);

/**
 * Test 4.3: Change password without token (Error)
 */
console.log('\n=== Test 4.3: Change password without token ===');
fetch(`${BASE_URL}/change-password`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    currentPassword: 'password123',
    newPassword: 'newPassword456'
  })
})
  .then(res => res.json())
  .then(data => {
    console.log('Status:', !data.success ? '✓ PASS' : '✗ FAIL');
    console.log('Error:', data.message);
  });

// ============================================
// 5. VERIFY TOKEN TESTS
// ============================================

/**
 * Test 5.1: Verify token with valid token (Success)
 */
console.log('\n=== Test 5.1: Verify token with valid token ===');
setTimeout(() => {
  if (authToken) {
    fetch(`${BASE_URL}/verify-token`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log('Status:', data.success ? '✓ PASS' : '✗ FAIL');
        console.log('Token info:', data.data);
      });
  }
}, 3000);

/**
 * Test 5.2: Verify token with invalid token (Error)
 */
console.log('\n=== Test 5.2: Verify token with invalid token ===');
fetch(`${BASE_URL}/verify-token`, {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer invalid.token'
  }
})
  .then(res => res.json())
  .then(data => {
    console.log('Status:', !data.success ? '✓ PASS' : '✗ FAIL');
    console.log('Error:', data.message);
  });

// ============================================
// TEST SUMMARY
// ============================================

console.log('\n');
console.log('╔════════════════════════════════════════════════════╗');
console.log('║       Authentication API - Test Summary           ║');
console.log('╠════════════════════════════════════════════════════╣');
console.log('║  Test 1: Registration (5 tests)                   ║');
console.log('║  Test 2: Login (4 tests)                          ║');
console.log('║  Test 3: Get Current User (3 tests)               ║');
console.log('║  Test 4: Change Password (3 tests)                ║');
console.log('║  Test 5: Verify Token (2 tests)                   ║');
console.log('║                                                    ║');
console.log('║  Total: 17 tests                                  ║');
console.log('╚════════════════════════════════════════════════════╝');
console.log('\nRun this file in browser console or with Node.js');
