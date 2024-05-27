import jwt from "jsonwebtoken";
import { createError } from "./errorHandler.js";
import prisma from "../db/db.config.js";

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return next(createError(401, "You are not authenticated"));

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(createError(403, "Token is not valid"));
    req.user = user;
    next();
  });
};

export const authorize = async (req, res, next) => {
  const user = req.user;
  const itemId = Number(req.params.id);
  const item = await prisma.item.findUnique({ where: { id: itemId } });
  if (!item) return next(createError(404, "Item not found"));

  if (item.userId === user.id || user.role === "admin") next();
  else return next(createError(403, "You are not authorized"));
};
