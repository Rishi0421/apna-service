import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

import {
  getAdminDashboard,
  approveService,
  getAllUsers,
  blockUser,
  unblockUser,
  getAllProviders,
  getAllBookings,
  blockProvider,
  unblockProvider,
  getAllReports,
  resolveReport,
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/dashboard", protect, authorizeRoles("admin"), getAdminDashboard);

/* USERS */
router.get("/users", protect, authorizeRoles("admin"), getAllUsers);
router.put("/block/:id", protect, authorizeRoles("admin"), blockUser);
router.put("/unblock/:id", protect, authorizeRoles("admin"), unblockUser);

/* PROVIDERS */
router.get("/providers", protect, authorizeRoles("admin"), getAllProviders);
router.put("/providers/block/:id", protect, authorizeRoles("admin"), blockProvider);
router.put("/providers/unblock/:id", protect, authorizeRoles("admin"), unblockProvider);

/* SERVICES */
router.put(
  "/approve-service/:providerId/:serviceId",
  protect,
  authorizeRoles("admin"),
  approveService
);

/* REPORTS */
router.get("/reports", protect, authorizeRoles("admin"), getAllReports);
router.put("/reports/resolve/:id", protect, authorizeRoles("admin"), resolveReport);

// Bookings for admin
router.get("/bookings", protect, authorizeRoles("admin"), getAllBookings);

export default router;
