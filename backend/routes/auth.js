import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const router = express.Router();

// Register
router.post("/signup", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Basic validation
        if (!username || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }
        if (password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters" });
        }

        // Check existing
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ error: "Username or Email already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            username,
            email,
            password: hashedPassword
        });

        // Auto-login (create session)
        req.session.userId = user._id;

        console.log(`✅ New user registered: ${username} (${email})`);
        res.status(201).json({
            success: true,
            user: { id: user._id, username: user.username, email: user.email }
        });

    } catch (err) {
        console.error("❌ Signup Error:", err);
        res.status(500).json({ error: "Server error during registration" });
    }
});

// Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body; // Accepting email or username could be an option, sticking to email for now as per request "email & password"

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        // Check if Face MFA is enabled
        if (user.isFaceMFAEnabled) {
            console.log(`🔒 MFA Required for user: ${user.username}`);
            return res.json({
                success: true,
                mfaRequired: true,
                userId: user._id,
                username: user.username
            });
        }

        // Create session for non-MFA login
        req.session.userId = user._id;

        console.log(`🔑 User logged in: ${user.username}`);
        res.json({
            success: true,
            user: { id: user._id, username: user.username, email: user.email }
        });

    } catch (err) {
        console.error("❌ Login Error:", err);
        res.status(500).json({ error: "Server error during login" });
    }
});

// Logout
router.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ error: "Logout failed" });
        res.clearCookie("connect.sid"); // Default cookie name
        res.json({ success: true, message: "Logged out" });
    });
});

// Me (Check Session)
router.get("/me", async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: "Not authenticated" });
    }

    try {
        const user = await User.findById(req.session.userId).select("-password -faceDescriptor -authenticators");
        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }
        res.json({ user });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

// Enable Face MFA
router.post("/enable-face-mfa", async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const { descriptor } = req.body;
        // Validate descriptor format and typical length (128 for face-api.js ResNet)
        if (!descriptor || !Array.isArray(descriptor) || descriptor.length !== 128) {
            return res.status(400).json({ error: "Invalid biometric data format. Please try scanning again." });
        }

        await User.findByIdAndUpdate(req.session.userId, {
            faceDescriptor: descriptor,
            isFaceMFAEnabled: true
        });

        console.log(`📸 Face MFA enabled for user ID: ${req.session.userId}`);
        res.json({ success: true, message: "Face MFA enabled successfully" });
    } catch (err) {
        console.error("MFA Enable Error:", err);
        res.status(500).json({ error: "Failed to enable MFA" });
    }
});

// Verify Face MFA (Login transition)
router.post("/verify-face-mfa", async (req, res) => {
    try {
        const { userId, descriptor } = req.body;
        if (!userId || !descriptor || !Array.isArray(descriptor) || descriptor.length !== 128) {
            return res.status(400).json({ error: "Invalid biometric data received." });
        }

        const user = await User.findById(userId);
        if (!user || !user.isFaceMFAEnabled) {
            return res.status(400).json({ error: "MFA not available for this user" });
        }

        // Validate stored descriptor
        const storedDescriptor = user.faceDescriptor;
        if (!storedDescriptor || storedDescriptor.length !== 128) {
            console.error(`❌ Corrupt biometric data for user: ${user.username}`);
            return res.status(500).json({ error: "Stored biometric data is invalid. Please reset MFA." });
        }

        // Euclidean distance comparison
        const distance = Math.sqrt(
            descriptor.reduce((sum, val, i) => sum + Math.pow(val - storedDescriptor[i], 2), 0)
        );

        console.log(`📏 Face match distance: ${distance.toFixed(4)}`);

        // Strict threshold for higher security (0.6 is standard, 0.5 is stricter)
        if (distance < 0.5) {
            req.session.userId = user._id;
            console.log(`✅ MFA Verified for user: ${user.username}`);
            return res.json({
                success: true,
                user: { id: user._id, username: user.username, email: user.email }
            });
        }

        res.status(401).json({ error: "Face verification failed. Please try again." });
    } catch (err) {
        console.error("MFA Verify Error:", err);
        res.status(500).json({ error: "Server error during verification" });
    }
});

// Update Password
router.post("/update-password", async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: "Both current and new passwords are required" });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ error: "New password must be at least 6 characters" });
        }

        const user = await User.findById(req.session.userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Incorrect current password" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        console.log(`🔐 Password updated for user: ${user.username}`);
        res.json({ success: true, message: "Password updated successfully" });

    } catch (err) {
        console.error("Password Update Error:", err);
        res.status(500).json({ error: "Failed to update password" });
    }
});

export default router;
