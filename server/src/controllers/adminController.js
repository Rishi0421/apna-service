import User from "../models/User.js";
import Provider from "../models/Provider.js";
import Booking from "../models/Booking.js";
import Notification from "../models/Notification.js";
import Report from "../models/Report.js";

/* ================= ADMIN DASHBOARD ================= */
export const getAdminDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalProviders = await User.countDocuments({ role: "provider" });

    const verifiedProviders = await Provider.countDocuments({ isVerified: true });
    const pendingProviders = await Provider.countDocuments({ isVerified: false });

    const totalBookings = await Booking.countDocuments();
    const completedJobs = await Booking.countDocuments({ status: "completed" });

    res.json({
      stats: {
        totalUsers,
        totalProviders,
        verifiedProviders,
        pendingProviders,
        totalBookings,
        completedJobs,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Admin dashboard error" });
  }
};

/* ================= APPROVE SERVICE (FINAL FIX) ================= */
export const approveService = async (req, res) => {
  try {
    const { providerId, serviceId } = req.params;

    const provider = await Provider.findById(providerId);
    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    const service = provider.services.id(serviceId); // 🔥 IMPORTANT
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    service.isApproved = true;
    provider.isVerified = true;

    await provider.save(); // ✅ enough

    await Notification.create({
      user: provider.user,
      text: `Your service "${service.name}" has been approved`,
    });

    res.json({ message: "Service approved successfully" });
  } catch (err) {
    console.error("APPROVE SERVICE ERROR:", err);
    res.status(500).json({ message: "Service approval failed" });
  }
};

/* ================= USERS ================= */
export const getAllUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};

export const blockUser = async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { isBlocked: true });
  res.json({ message: "User blocked" });
};

export const unblockUser = async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { isBlocked: false });
  res.json({ message: "User unblocked" });
};

/* ================= PROVIDERS ================= */
export const getAllProviders = async (req, res) => {
  const providers = await Provider.find()
    .populate("user", "name email isBlocked");

  const validProviders = providers.filter(p => p.user !== null);
  res.json(validProviders);
};

export const blockProvider = async (req, res) => {
  const provider = await Provider.findById(req.params.id).populate("user");
  if (!provider) return res.status(404).json({ message: "Provider not found" });

  provider.user.isBlocked = true;
  await provider.user.save();

  res.json({ message: "Provider blocked successfully" });
};

export const unblockProvider = async (req, res) => {
  const provider = await Provider.findById(req.params.id).populate("user");
  if (!provider) return res.status(404).json({ message: "Provider not found" });

  provider.user.isBlocked = false;
  await provider.user.save();

  res.json({ message: "Provider unblocked successfully" });
};

/* ================= REPORTS ================= */
export const getAllReports = async (req, res) => {
  const reports = await Report.find()
    .populate("user", "name email")
    .populate("provider", "name")
    .populate("booking")
    .sort({ createdAt: -1 });

  res.json(reports);
};

export const resolveReport = async (req, res) => {
  await Report.findByIdAndUpdate(req.params.id, { resolved: true });
  res.json({ message: "Report resolved" });
};

/* ================= ADMIN BOOKINGS ================= */
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate({ path: "provider", populate: { path: "user", select: "name email" } })
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    console.error("GET ALL BOOKINGS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};
