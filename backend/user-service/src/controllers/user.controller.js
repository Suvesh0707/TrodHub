import userModel from "../models/user.model.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken.js";
import bcrypt from "bcrypt";

/**
 * Helper to send auth response
 */
const sendAuthResponse = async (res, user, message, statusCode = 200) => {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // hash refresh token before saving
  const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
  user.refreshToken = hashedRefreshToken;
  await user.save();

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax", // changed from strict
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  const safeUser = {
    _id: user._id,
    fullname: user.fullname,
    email: user.email,
    role: user.role,
  };

  return res.status(statusCode).json({
    message,
    accessToken,
    user: safeUser,
  });
};

/**
 * REGISTER
 */
export const userRegister = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    if (!fullname || !email || !password) {
      return res.status(400).json({
        message: "All fields required",
      });
    }

    // basic email validation
    if (!email.includes("@")) {
      return res.status(400).json({
        message: "Invalid email format",
      });
    }

    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists, please login",
      });
    }

    // hash password (if not using pre-save hook)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔒 force role to "user"
    const user = await userModel.create({
      fullname,
      email,
      password: hashedPassword,
      role: "user",
    });

    return sendAuthResponse(res, user, "User registered successfully", 201);

  } catch (error) {
    return res.status(500).json({
      message: "Error during registration",
      error: error.message,
    });
  }
};

/**
 * LOGIN
 */
export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // explicitly select password (since we used select: false)
    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    return sendAuthResponse(res, user, "Login successful");

  } catch (error) {
    return res.status(500).json({
      message: "Error during login",
      error: error.message,
    });
  }
};

/**
 * LOGOUT
 */
export const userLogout = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(400).json({
        message: "No token found",
      });
    }

    const users = await userModel.find({ refreshToken: { $ne: null } });

    let matchedUser = null;

    // compare hashed refresh tokens
    for (const user of users) {
      const isMatch = await bcrypt.compare(token, user.refreshToken);
      if (isMatch) {
        matchedUser = user;
        break;
      }
    }

    if (matchedUser) {
      matchedUser.refreshToken = null;
      await matchedUser.save();
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return res.status(200).json({
      message: "Logout successful",
    });

  } catch (error) {
    return res.status(500).json({
      message: "Error during logout",
      error: error.message,
    });
  }
};