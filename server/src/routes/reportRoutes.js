import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { createReport, getAllReports } from "../controllers/reportController.js";
import { resolveReport } from "../controllers/reportController.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("user", "provider"), createReport);
router.get("/", protect, authorizeRoles("admin"), getAllReports);
router.put(
  "/:id/resolve",
  protect,
  authorizeRoles("admin"),
  resolveReport
);

export default router;
