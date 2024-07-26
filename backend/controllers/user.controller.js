const User = require("../models/user.models");
const catchAsync = require("../utils/catchAsync");


exports.fetchUsers = catchAsync(async (req, res) => {
    const users = await User.findById(req.user.id);
    users.password = undefined; // remove password from response
    return res.status(200).json({
        success: true,
        message: "Users fetched successfully",
        data: users
    });

})