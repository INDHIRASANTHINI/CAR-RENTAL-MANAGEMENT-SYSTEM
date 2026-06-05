const User = require('../models/User');
const { generateTokens } = require('../utils/tokenUtils');

exports.register = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, phone, role = 'customer' } = req.body;

    console.log('[authController] Registration request received:', { email, firstName, lastName, phone, role });

    // Validate required fields
    if (!email || !password || !firstName || !lastName || !phone) {
      console.log('[authController] Missing required fields');
      return res.status(400).json({ message: 'All fields are required: email, password, firstName, lastName, phone' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log('[authController] User already exists:', email);
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = new User({
      email,
      password,
      firstName,
      lastName,
      phone,
      role
    });

    console.log('[authController] Creating user:', email);
    await user.save();
    console.log('[authController] User saved successfully');

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id, user.role);

    // Set refresh token cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    console.log('[authController] Registration successful for user:', email);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        role: user.role
      },
      accessToken
    });
  } catch (error) {
    console.error('[authController] Registration error:', error.message);
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      console.log(`[Login] User not found: ${email}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log(`[Login] User found: ${email}, Role: ${user.role}, ID: ${user._id}`);

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id, user.role);

    // Set refresh token cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        role: user.role
      },
      accessToken
    });
  } catch (error) {
    next(error);
  }
};

exports.logout = (req, res) => {
  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out successfully' });
};

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, phone, address, profilePicture } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { firstName, lastName, phone, address, profilePicture, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    next(error);
  }
};
