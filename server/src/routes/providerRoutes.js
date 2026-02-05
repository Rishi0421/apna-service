import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { updateServicePrice } from "../controllers/providerController.js";
import { deleteService } from "../controllers/providerController.js";
import { uploadServiceImage } from "../middleware/upload.js";

import {
  createProviderProfile,
  searchProviders,
  verifyProvider,
  getAllProviders,
  getProviderDashboard,
  getMyReviews,
  getMyProviderProfile,
  updateProviderProfile,
  addService,
  getAllApprovedServices,
} from "../controllers/providerController.js";
import { toggleAvailability } from "../controllers/providerController.js";

const router = express.Router();

/* PROVIDER */
router.post("/create", protect, authorizeRoles("user"), createProviderProfile);
router.get("/me", protect, authorizeRoles("provider"), getMyProviderProfile);
router.put("/me", protect, authorizeRoles("provider"), updateProviderProfile);
router.post(
  "/add-service",
  protect,
  authorizeRoles("provider"),
  uploadServiceImage.single("image"),
  addService
);

router.get("/dashboard", protect, authorizeRoles("provider"), getProviderDashboard);
router.get("/reviews", protect, authorizeRoles("provider"), getMyReviews);

/* PUBLIC */
router.get("/search", searchProviders);
router.get("/services", getAllApprovedServices);

/* ADMIN */
router.put("/verify/:providerId", protect, authorizeRoles("admin"), verifyProvider);
router.get("/all", protect, authorizeRoles("admin"), getAllProviders);
router.put(
  "/availability",
  protect,
  authorizeRoles("provider"),
  toggleAvailability
);
router.put(
  "/service-price",
  protect,
  authorizeRoles("provider"),
  updateServicePrice
);
router.delete(
  "/service/:serviceId",
  protect,
  authorizeRoles("provider"),
  deleteService
);

export default router;
