import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import { uploadAvatar } from "../middleware/multer.js";
import { uploadUserAvatar } from "../controllers/userController.js";

const router = express.Router();

/* ================================
   GET USER PROFILE
================================ */
router.get("/profile", protect, (req, res) => {
  res.json(req.user);
});

/* ================================
   UPDATE USER PROFILE
================================ */
router.put("/profile", protect, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      req.body,
      { new: true }
    ).select("-password");

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ================================
   UPLOAD AVATAR (FINAL FIX)
================================ */
router.put(
  "/upload-avatar",
  protect,
  (req, res, next) => {
    uploadAvatar.single("avatar")(req, res, (err) => {
      if (err) {
        return res.status(400).json({
          message: err.message || "Avatar upload failed",
        });
      }
      next();
    });
  },
  uploadUserAvatar
);

export default router;
