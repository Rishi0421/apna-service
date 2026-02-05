import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import {
  createBooking,
  updateBookingStatus,
  getUserBookings,
  getProviderBookings,
} from "../controllers/bookingController.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("user"), createBooking);
router.put("/:id", protect, authorizeRoles("provider"), updateBookingStatus);
router.get("/user", protect, authorizeRoles("user"), getUserBookings);
router.get("/provider", protect, authorizeRoles("provider"), getProviderBookings);

export default router;
