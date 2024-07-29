const User = require("../models/user.models");
const catchAsync = require("../utils/catchAsync");
const cryptoJS = require("crypto-js");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");


exports.fetchUsers = catchAsync(async (req, res) => {
    const users = await User.findById(req.user.id);
    users.password = undefined; // remove password from response
    return res.status(200).json({
        success: true,
        message: "Users fetched successfully",
        data: users
    });

})

exports.sendPasswordResetEmail = catchAsync(async (req, res) => {
    const { email } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
    }

    // Generate OTP using crypto-js and set expiry time
    const otp = cryptoJS.lib.WordArray.random(3).toString().toUpperCase(); // 4-digit OTP
    user.resetPasswordOTP = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
    await user.save();

    // Compose email content
    const subject = "Password Reset Request";
    const body = `<p>Dear ${user.name},</p>
                  <p>Your OTP for password reset is: <strong>${otp}</strong></p>
                  <p>This OTP is valid for 10 minutes.</p>`;

    // Send email
    try {
        await mailSender(user.email, subject, body);
        res.status(200).json({ success: true, message: "OTP sent to email" });
    } catch (err) {
        console.error("Error sending email:", err);
        res.status(500).json({ success: false, message: "Failed to send OTP email" });
    }
});

exports.verifyOTPAndResetPassword = catchAsync(async (req, res) => {
    const { email, otp, newPassword } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
    }

    // Check if OTP matches and is not expired
    if (user.resetPasswordOTP !== otp || user.otpExpiry < Date.now()) {
        return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    // Hash new password and update user
    user.password = await bcrypt.hash(newPassword, 12);
    user.resetPasswordOTP = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.status(200).json({ success: true, message: "Password reset successfully" });
});