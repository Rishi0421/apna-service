import User from "../models/User.js";

/* ================================
   GET LOGGED IN USER PROFILE
================================ */
export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================================
   UPDATE LOGGED IN USER PROFILE
================================ */
export const updateMyProfile = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        name: req.body.name,
        phone: req.body.phone,
        state: req.body.state,
        city: req.body.city,
        pincode: req.body.pincode,
        address: req.body.address,
      },
      { new: true }
    ).select("-password");

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================================
   UPLOAD USER AVATAR
================================ */
export const uploadUserAvatar = async (req, res) => {
  try {
    if (!req.file) {
      console.error("❌ No file in request");
      return res.status(400).json({ message: "No file uploaded" });
    }

    console.log("📁 File received:", {
      filename: req.file.filename,
      path: req.file.path,
      mimetype: req.file.mimetype,
      size: req.file.size,
    });

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const avatarPath = `/uploads/avatars/${req.file.filename}`;
    user.avatar = avatarPath;
    await user.save();

    console.log("✅ Avatar saved to DB:", {
      userId: user._id,
      avatarPath: user.avatar,
    });

    res.json({
      message: "Avatar uploaded successfully",
      avatar: user.avatar,
    });
  } catch (error) {
    console.error("❌ AVATAR ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};