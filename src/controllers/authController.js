import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import { RegisterDto, LoginDto, TokenDto, GoogleProfileDto } from '../dtos/authDto.js';

export const register = async (req, res) => {
  const { email, password, confirmPassword } = new RegisterDto(req.body.email, req.body.password, req.body.confirmPassword);
  
  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword });
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = new LoginDto(req.body.email, req.body.password);
  
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    if (user.resign_at) {
      return res.status(403).json({ error: 'This account has been deleted.' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const accessToken = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ userId: user.user_id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

    user.refresh_token = refreshToken;
    user.status = 1; // 로그인 시 status를 1로 설정
    user.access_at = new Date(); // 로그인 시 access_at을 현재 시간으로 설정
    await user.save();

    res.status(200).json({ message: 'Login successful', accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const refreshToken = async (req, res) => {
  const { refreshToken } = new TokenDto(req.body.refreshToken);

  if (!refreshToken) {
    return res.status(401).json({ error: 'Refresh Token required' });
  }

  try {
    const user = await User.findOne({ where: { refresh_token: refreshToken } });
    if (!user) {
      return res.status(403).json({ error: 'Invalid Refresh Token' });
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid Refresh Token' });
      }

      const accessToken = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET, { expiresIn: '15m' });
      res.status(200).json({ accessToken });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const logout = async (req, res) => {
  const user = req.user;
  user.refresh_token = null;
  user.status = 0; // 로그아웃 시 status를 0으로 설정
  await user.save();

  res.status(200).json({ message: 'Logout successful' });
};

export const getProfile = async (req, res) => {
  res.json(req.user); // 미들웨어를 통해 추가된 사용자 정보를 응답
};

export const deleteAccount = async (req, res) => {
  const user = req.user;
  user.resign_at = new Date(); // 탈퇴 시 resign_at을 현재 시간으로 설정
  user.status = 0; // 탈퇴 시 status를 0으로 설정
  await user.save();

  res.status(200).json({ message: 'Account deleted successfully' });
};

export const updateUserInfo = async (req, res) => {
  const { name, phone } = req.body;
  const profileImage = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const user = req.user;

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.name = name;
    user.phone = phone;

    if (profileImage) {
      user.profile_image = profileImage; // 프로필 이미지 URL로 업데이트
    }

    await user.save();

    res.status(200).json({
      message: 'User information updated successfully',
      user: {
        ...user.toJSON(),
        profile_image: user.profile_image // profile_image에 URL 저장
      }
    });
  } catch (error) {
    console.error('Update User Info Error:', error);
    res.status(500).json({ error: error.message });
  }
};
export const changePassword = async (req, res) => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;

  if (newPassword !== confirmNewPassword) {
    return res.status(400).json({ error: 'New passwords do not match' });
  }

  try {
    const user = req.user;

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const googleLogin = async (profile) => {
  const googleProfile = GoogleProfileDto.fromProfile(profile);

  try {
    const [user, created] = await User.findOrCreate({
      where: { email: googleProfile.email },
      defaults: {
        email: googleProfile.email,
        password: null,
        name: googleProfile.displayName,
        profile_image: googleProfile.photos,
        access_at: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
        status: 1,
      }
    });

    if (!created) {
      user.access_at = new Date();
      await user.save();
    }

    const accessToken = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ userId: user.user_id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

    user.refresh_token = refreshToken;
    await user.save();

    return { accessToken, refreshToken };
  } catch (error) {
    throw new Error('Google login error: ' + error.message);
  }
};