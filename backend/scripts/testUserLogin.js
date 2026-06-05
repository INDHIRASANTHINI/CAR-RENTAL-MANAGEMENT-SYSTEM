const mongoose = require('mongoose');
const User = require('../src/models/User');

async function testUserLogin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/carRental');
    
    console.log('Connected to MongoDB\n');
    
    // Create test user if doesn't exist
    let testUser = await User.findOne({ email: 'testuser@carental.com' });
    if (!testUser) {
      testUser = new User({
        email: 'testuser@carental.com',
        password: 'Test@123456',
        firstName: 'Test',
        lastName: 'User',
        phone: '1234567890',
        role: 'customer'
      });
      await testUser.save();
      console.log('✓ Test user created');
    } else {
      console.log('✓ Test user already exists');
    }
    
    // List all users in database
    const allUsers = await User.find({}, { email: 1, role: 1 });
    console.log('\n📋 All users in database:');
    allUsers.forEach(u => console.log(`  - ${u.email} (${u.role})`));
    
    console.log('\n✅ Ready for testing!');
    console.log('📧 Test User Credentials:');
    console.log('  Email: testuser@carental.com');
    console.log('  Password: Test@123456');
    console.log('  Role: customer');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

testUserLogin();
