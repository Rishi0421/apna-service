import Report from "../models/Report.js";
import Booking from "../models/Booking.js";
import Provider from "../models/Provider.js";

export const createReport = async (req, res) => {
  try {
    const { bookingId, reason } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    let reportedUser;
    let role;

    if (req.user.role === "user") {
      const providerDoc = await Provider.findById(booking.provider).populate("user");
      reportedUser = providerDoc?.user?._id || booking.provider;
      role = "user";
    } else if (req.user.role === "provider") {
      reportedUser = booking.user;
      role = "provider";
    } else {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const exists = await Report.findOne({
      reporter: req.user._id,
      booking: bookingId,
    });

    if (exists) {
      return res.status(400).json({ message: "Report already submitted" });
    }

    const report = await Report.create({
      reporter: req.user._id,
      reportedUser,
      booking: bookingId,
      reason,
      role,
    });

    res.status(201).json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ADMIN VIEW
export const getAllReports = async (req, res) => {
  const reports = await Report.find()
    .populate("reporter", "name role")
    .populate("reportedUser", "name role")
    .populate("booking");

  res.json(reports);
};

export const resolveReport = async (req, res) => {
  const report = await Report.findById(req.params.id);
  if (!report) {
    return res.status(404).json({ message: "Report not found" });
  }

  report.status = "resolved";
  await report.save();

  res.json({ message: "Report resolved" });
};

