import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'dss_jwt_placement_secret_key_2026', {
    expiresIn: '30d',
  });
};

const formatUserResponse = (user) => {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    age: user.age || 21,
    college: user.college || '',
    graduationYear: user.graduationYear || 2026,
    role: user.role,
    subscription: user.subscription,
    isSubscribed: user.isSubscribed(),
    solvedQuestions: user.solvedQuestions,
    bookmarkedQuestions: user.bookmarkedQuestions,
    streak: user.streak,
  };
};

// @desc Register a new student
// @route POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, email, password, phone, college, age, graduationYear, firebaseUid } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    const user = await User.create({
      name: name || email.split('@')[0],
      email: email.toLowerCase(),
      password,
      phone: phone || '',
      college: college || 'CSE Engineering College',
      age: age ? Number(age) : 21,
      graduationYear: graduationYear ? Number(graduationYear) : 2026,
      firebaseUid: firebaseUid || '',
      authProvider: 'email',
      subscription: {
        status: 'none',
      },
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: formatUserResponse(user),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Login student or admin
// @route POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: formatUserResponse(user),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Firebase Google / Email Sync Login & Register
// @route POST /api/auth/firebase-login
export const firebaseGoogleAuth = async (req, res) => {
  try {
    const { email, name, phone, college, age, graduationYear, firebaseUid, authProvider } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required for Firebase sync' });
    }

    let user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Auto register new student synced with Firebase
      const generatedPassword = 'Firebase_' + Math.random().toString(36).substring(2, 12);
      user = await User.create({
        name: name || email.split('@')[0],
        email: email.toLowerCase(),
        password: generatedPassword,
        phone: phone || '',
        college: college || 'CSE Engineering College',
        age: age ? Number(age) : 21,
        graduationYear: graduationYear ? Number(graduationYear) : 2026,
        firebaseUid: firebaseUid || '',
        authProvider: authProvider || 'google',
        subscription: {
          status: 'none', // Strictly requires ₹1,000/mo subscription to unlock dashboard
        },
      });
      console.log(`✅ New student registered and synced via Firebase: ${user.email}`);
    } else {
      // Update any optional profile details if passed
      let modified = false;
      if (phone && !user.phone) { user.phone = phone; modified = true; }
      if (college && user.college === 'CSE Engineering College') { user.college = college; modified = true; }
      if (age && !user.age) { user.age = Number(age); modified = true; }
      if (firebaseUid && !user.firebaseUid) { user.firebaseUid = firebaseUid; modified = true; }
      if (modified) await user.save();
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: formatUserResponse(user),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get current user profile
// @route GET /api/auth/me
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      user: formatUserResponse(user),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
