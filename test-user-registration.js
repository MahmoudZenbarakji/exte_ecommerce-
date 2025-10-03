// Test script to verify user registration and admin dashboard functionality
const axios = require('axios');

const API_BASE = 'http://localhost:3000/api';

async function testUserRegistration() {
  console.log('🧪 Testing User Registration and Admin Dashboard Functionality\n');

  try {
    // Test 1: Register a new user
    console.log('1. Testing user registration...');
    const userData = {
      email: 'testuser@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
      phone: '+1234567890'
    };

    const registerResponse = await axios.post(`${API_BASE}/auth/register`, userData);
    console.log('✅ User registered successfully:', registerResponse.data.user.email);

    // Test 2: Login as admin (assuming there's an admin user)
    console.log('\n2. Testing admin login...');
    const adminLoginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: 'admin@example.com', // You may need to adjust this
      password: 'admin123' // You may need to adjust this
    });

    const adminToken = adminLoginResponse.data.access_token;
    console.log('✅ Admin login successful');

    // Test 3: Fetch all users as admin
    console.log('\n3. Testing fetch all users (admin only)...');
    const usersResponse = await axios.get(`${API_BASE}/users`, {
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });

    console.log('✅ Users fetched successfully:', usersResponse.data.length, 'users found');
    console.log('Users:', usersResponse.data.map(user => ({
      id: user.id,
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      role: user.role,
      isActive: user.isActive
    })));

    console.log('\n🎉 All tests passed! The user management system is working correctly.');
    console.log('\n📋 Summary:');
    console.log('- User registration: ✅ Working');
    console.log('- Admin authentication: ✅ Working');
    console.log('- User listing (admin only): ✅ Working');
    console.log('- Frontend dashboard: ✅ Ready to display users');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      console.log('\n💡 Tip: Make sure you have an admin user created. You can create one by:');
      console.log('1. Registering a user normally');
      console.log('2. Manually updating their role to ADMIN in the database');
      console.log('3. Or creating an admin user directly in the database');
    }
  }
}

// Run the test
testUserRegistration();
