import vine, { errors } from "@vinejs/vine";
import prisma from "../db/db.config.js";
import { createError } from "../middlewares/errorHandler.js";
import { itemSchema } from "../validations/itemBidValidation.js";

export const createNewItem = async (req, res, next) => {
  const body = req.body;
  const userId = req.user.id;
  try {
    const validator = vine.compile(itemSchema);
    const { name, description, startingPrice, currentPrice, endTime } =
      await validator.validate(body);
    const item = await prisma.item.create({
      data: {
        name,
        description,
        startingPrice,
        currentPrice: currentPrice || startingPrice,
        imageUrl: req.file?.filename || null,
        endTime,
        userId,
      },
    });
    res
      .status(200)
      .json({ message: "Item has been created Successfully", item });
  } catch (error) {
    if (error instanceof errors.E_VALIDATION_ERROR) {
      return next(createError(400, error.messages));
    }
    next(error);
  }
};

export const updateItem = async (req, res, next) => {
  const itemId = Number(req.params.id);
  const body = req.body;
  try {
    const validator = vine.compile(itemSchema);
    const { name, description, startingPrice, currentPrice, endTime } =
      await validator.validate(body);
    const existItem = await prisma.item.findUnique({ where: { id: itemId } });
    if (!existItem) throw createError(404, "Item not found");

    const updatedItem = await prisma.item.update({
      where: { id: itemId },
      data: {
        name,
        description,
        startingPrice,
        currentPrice: currentPrice || startingPrice,
        imageUrl: req.file?.filename || existItem.imageUrl,
        endTime,
      },
    });
    res
      .status(200)
      .json({ message: "Item has been updated Successfully", updatedItem });
  } catch (error) {
    next(error);
  }
};

export const deleteItem = async (req, res, next) => {
  const itemId = Number(req.params.id);
  try {
    await prisma.item.delete({
      where: { id: itemId },
    });
    res.json({ message: "Item has been deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const getAllItems = async (req, res, next) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  if (page <= 0) page = 1;
  if (limit <= 0 || limit > 100) limit = 10;
  const skip = (page - 1) * limit;

  let { search, status } = req.query;
  search = search ? search.trim() : "";
  status = status ? status.trim().toLowerCase() : "";
  const searchCondition = search
    ? { name: { contains: search, mode: "insensitive" } }
    : {};
  const statusCondition = status
    ? status === "active"
      ? { endTime: { gt: new Date() } }
      : status === "ended"
      ? { endTime: { lte: new Date() } }
      : {}
    : {};
  const condition = { AND: [searchCondition, statusCondition] };

  try {
    const allItems = await prisma.item.findMany({
      where: condition,
      take: limit,
      skip,
    });

    const totalItem = await prisma.item.count({ where: condition });
    const totalPages = Math.ceil(totalItem / limit);

    res.status(200).json({
      allItems,
      metaData: { totalPages, currentPage: page, currentLimit: limit },
    });
  } catch (error) {
    next(error);
  }
};

export const getSingleItem = async (req, res, next) => {
  const itemId = Number(req.params.id);
  try {
    const item = await prisma.item.findUnique({
      where: { id: itemId },
    });
    if (!item) throw createError(404, "Item not found");

    res.status(200).json(item);
  } catch (error) {
    next(error);
  }
};
