import userModel from "../models/user.model.js";
import bcrypt from "bcrypt";

/**
 * Superadmin can create admin or customer_support.
 * Admin can create customer_support.
 */
export const createAccountByAdmin = async (req, res) => {
  try {
    const { fullname, email, password, role } = req.body;
    const requesterRole = req.user.role;

    if (!fullname || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validation based on requester role
    if (requesterRole === "admin" && role !== "customer_support") {
      return res.status(403).json({ message: "Admins can only create Customer Support accounts" });
    }

    if (requesterRole === "superadmin" && !["admin", "customer_support"].includes(role)) {
      return res.status(400).json({ message: "Invalid role for superadmin creation" });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.create({
      fullname,
      email,
      password: hashedPassword,
      role,
    });

    return res.status(201).json({
      message: `${role} account created successfully`,
      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Error creating account", error: error.message });
  }
};

/**
 * Admin/Superadmin can ban a user
 */
export const banUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "superadmin") {
      return res.status(403).json({ message: "Superadmin cannot be banned" });
    }

    user.isBanned = true;
    await user.save();

    return res.status(200).json({ message: "User banned successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error banning user", error: error.message });
  }
};

/**
 * Admin/Superadmin can unban a user
 */
export const unbanUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isBanned = false;
    await user.save();

    return res.status(200).json({ message: "User unbanned successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error unbanning user", error: error.message });
  }
};

/**
 * Admin/Superadmin platform analytics
 */
export const getPlatformAnalytics = async (req, res) => {
  try {
    const totalUsers = await userModel.countDocuments();
    const roleStats = await userModel.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } }
    ]);

    return res.status(200).json({
      totalUsers,
      roleStats,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching analytics", error: error.message });
  }
};

/**
 * Placeholder for Dispute Resolution
 */
export const resolveDispute = async (req, res) => {
  try {
    const { disputeId, resolution } = req.body;
    // logic would go here
    return res.status(200).json({
      message: `Dispute ${disputeId} has been resolved with: ${resolution}`,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error resolving dispute", error: error.message });
  }
};
