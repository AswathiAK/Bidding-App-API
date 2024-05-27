import express from "express";
import { authenticate } from "../middlewares/authorization.js";
import {
  getAllNotifications,
  markNotificationAsRead,
} from "../controllers/notificationController.js";

const router = express.Router();

router.get("/", authenticate, getAllNotifications);
router.post("/mark-read", authenticate, markNotificationAsRead);

export default router;
