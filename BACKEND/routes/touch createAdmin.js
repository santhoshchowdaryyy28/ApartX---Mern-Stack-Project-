require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const createAdmin = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const existing = await User.findOne({ email: 'chundrusanthoshchowdary@gmail.com' });
  if (existing) {
    existing.role = 'admin';
    await existing.save();
    console.log('✅ Existing user updated to admin!');
    process.exit();
  }

  const admin = await User.create({
    name: 'Santhosh Admin',
    email: 'chundrusanthoshchowdary@gmail.com',
    password: 'your_password_here',
    role: 'admin'
  });

  console.log('✅ Admin created:', admin.email);
  process.exit();
};

createAdmin();