import prisma from "../db/db.config.js";
import { createError } from "../middlewares/errorHandler.js";

export const getAllNotifications = async (req, res, next) => {
  const userId = req.user.id;
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId },
    });
    res.status(200).json(notifications);
  } catch (error) {
    next(error);
  }
};

export const markNotificationAsRead = async (req, res, next) => {
  const userId = req.user.id;
  const { notificationId } = req.body;
  try {
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });
    if (notification.userId !== userId) throw createError(403, "Unauthorized");
    await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
    res.status(200).json({ message: "Notification marked as read" });
  } catch (error) {
    next(error);
  }
};
