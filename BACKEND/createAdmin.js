require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');

    const existing = await User.findOne({ email: 'admin@apartx.com' });
    if (existing) {
      existing.role = 'admin';
      await existing.save();
      console.log('✅ User updated to admin!');
      process.exit();
    }

    await User.create({
      name: 'Admin',
      email: 'admin@apartx.com',
      password: 'Admin@123',
      role: 'admin'
    });

    console.log('✅ Admin created successfully!');
    console.log('📧 Email: admin@apartx.com');
    console.log('🔑 Password: Admin@123');
    process.exit();
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
};

createAdmin();