import Booking from "../models/Booking.js";
import Provider from "../models/Provider.js";
import Chat from "../models/Chat.js";
import Notification from "../models/Notification.js";

/* ================= CREATE BOOKING ================= */
export const createBooking = async (req, res) => {
  try {
    const {
      providerId, // ✅ Provider PROFILE ID
      serviceId,
      description,
      preferredDate,
      address,
    } = req.body;

    if (
      !providerId ||
      !serviceId ||
      !description ||
      !preferredDate ||
      !address
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const provider = await Provider.findById(providerId).populate("user");
    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    const service = provider.services.id(serviceId);
    if (!service || !service.isApproved) {
      return res.status(400).json({ message: "Invalid or unapproved service" });
    }

    const booking = await Booking.create({
      user: req.user._id,
      provider: provider._id, // ✅ PROVIDER PROFILE ID
      service: {
        serviceId: service._id,
        name: service.name,
      },
      description,
      preferredDate,
      address,
    });

    // Create notification
    const notification = await Notification.create({
      user: provider.user._id,
      text: `New booking request for ${service.name}`,
      message: `${req.user.name || 'A customer'} requested your ${service.name} service`,
      link: '/provider',
      type: 'booking_request'
    });

    // Emit socket event for real-time notification
    const io = req.app.get('io');
    if (io) {
      io.to(`user_${provider.user._id}`).emit('notificationReceived', notification);
    }

    res.status(201).json(booking);
  } catch (err) {
    console.error("CREATE BOOKING ERROR:", err);
    res.status(500).json({ message: "Booking create failed" });
  }
};

/* ================= PROVIDER UPDATE STATUS ================= */
export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // 🔥 Provider PROFILE check
    const providerProfile = await Provider.findOne({ user: req.user._id });
    if (!providerProfile) {
      return res.status(404).json({ message: "Provider profile not found" });
    }

    if (booking.provider.toString() !== providerProfile._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    booking.status = status;

    if (status === "accepted" && !booking.chat) {
      // booking.provider stores the Provider profile id; chat expects provider user id
      const providerDoc = await Provider.findById(booking.provider).populate("user");
      const providerUserId = providerDoc?.user?._id || providerProfile.user;

      const chat = await Chat.create({
        booking: booking._id,
        user: booking.user, // User._id
        provider: providerUserId, // Provider's User._id
      });

      booking.chat = chat._id;
    }

    const statusMessages = {
      accepted: "Your booking has been accepted",
      on_the_way: "Provider is on the way",
      started: "Job has started",
      completed: "Job completed successfully",
      rejected: "Your booking was rejected",
    };

    if (statusMessages[status]) {
      await Notification.create({
        user: booking.user,
        text: statusMessages[status],
      });
    }

    await booking.save();
    res.json(booking);
  } catch (err) {
    console.error("UPDATE BOOKING ERROR:", err);
    res.status(500).json({ message: "Update failed" });
  }
};

/* ================= USER BOOKINGS ================= */
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate({
        path: "provider",
        populate: { path: "user", select: "name" },
      })
      .populate("chat")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    console.error("GET USER BOOKINGS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};

/* ================= PROVIDER BOOKINGS ================= */
export const getProviderBookings = async (req, res) => {
  try {
    const provider = await Provider.findOne({ user: req.user._id });
    if (!provider) {
      return res.status(404).json({ message: "Provider profile not found" });
    }

    const bookings = await Booking.find({ provider: provider._id })
      .populate("user", "name")
      .populate("chat")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    console.error("GET PROVIDER BOOKINGS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch provider bookings" });
  }
};
