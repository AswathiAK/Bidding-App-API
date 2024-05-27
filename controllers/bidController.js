import vine, { errors } from "@vinejs/vine";
import prisma from "../db/db.config.js";
import { createError } from "../middlewares/errorHandler.js";
import { bidSchema } from "../validations/itemBidValidation.js";

export const placeBid = async (req, res, next) => {
  const userId = req.user.id;
  const itemId = Number(req.params.itemId);
  const body = req.body;
  try {
    const validator = vine.compile(bidSchema);
    const { bidAmount } = await validator.validate(body);

    const item = await prisma.item.findUnique({ where: { id: itemId } });
    if (!item || item.endTime < new Date() || bidAmount <= item.currentPrice) {
      throw createError(400, "Invalid bid");
    }

    const bid = await prisma.bid.create({
      data: {
        itemId,
        userId,
        bidAmount,
      },
    });
    await prisma.item.update({
      where: { id: itemId },
      data: { currentPrice: bidAmount },
    });
    await prisma.notification.create({
      data: {
        userId,
        message: `A new bid of ${bidAmount} is placed on the item ${item.name}`,
      },
    });
    res.status(200).json({ message: "Successfully placed the bid", bid });
  } catch (error) {
    if (error instanceof errors.E_VALIDATION_ERROR) {
      return next(createError(400, error.messages));
    }
    next(error);
  }
};

export const getBidsForItem = async (req, res, next) => {
  const itemId = Number(req.params.itemId);
  try {
    const bids = await prisma.bid.findMany({ where: { itemId } });
    res.status(200).json(bids);
  } catch (error) {
    next(error);
  }
};
