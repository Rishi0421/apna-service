import Review from "../models/Review.js";
import Booking from "../models/Booking.js";
import User from "../models/User.js";
import Provider from "../models/Provider.js";

// ADD REVIEW (ONLY AFTER COMPLETION)
export const addReview = async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // only booking owner can review
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // only completed jobs
    if (booking.status !== "completed") {
      return res
        .status(400)
        .json({ message: "You can review only after job completion" });
    }

    // prevent multiple reviews
    const exists = await Review.findOne({ booking: bookingId });
    if (exists) {
      return res
        .status(400)
        .json({ message: "Review already submitted" });
    }

    const providerDoc = await Provider.findById(booking.provider).populate("user");
    const providerUserId = providerDoc?.user?._id;

    const review = await Review.create({
      booking: booking._id,
      user: booking.user,
      provider: providerUserId,
      rating,
      comment,
    });

    // mark booking as reviewed ✅
    booking.reviewed = true;
    await booking.save();

    // update provider rating
    const reviews = await Review.find({ provider: providerUserId });
    const avgRating =
      reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

    await User.findByIdAndUpdate(providerUserId, {
      rating: avgRating.toFixed(1),
      totalReviews: reviews.length,
    });

    res.status(201).json(review);
  } catch (error) {
    console.error("ADD REVIEW ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// GET PROVIDER REVIEWS
export const getProviderReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      provider: req.params.providerId,
    }).populate("user", "name");

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
