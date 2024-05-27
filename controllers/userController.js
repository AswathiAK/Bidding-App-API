import vine, { errors } from "@vinejs/vine";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import prisma from "../db/db.config.js";
import { createError } from "../middlewares/errorHandler.js";
import {
  userLoginSchema,
  userRegisterSchema,
} from "../validations/userValidation.js";

const hashPassword = async (password) => {
  try {
    const bcryptSalt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, bcryptSalt);
    return hashedPassword;
  } catch (error) {
    throw new Error(error);
  }
};

export const registerUser = async (req, res, next) => {
  const body = req.body;
  try {
    const validator = vine.compile(userRegisterSchema);
    const { username, email, password } = await validator.validate(body);

    const findUser = await prisma.user.findFirst({
      where: { OR: [{ username }, { email }] },
    });
    if (findUser) throw createError(409, "User is already exist");

    const securePassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: securePassword,
        role: req.body.role,
      },
    });
    res.status(201).json({ message: "User created Successfully", user });
  } catch (error) {
    if (error instanceof errors.E_VALIDATION_ERROR) {
      return next(createError(400, error.messages));
    }
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  const body = req.body;
  try {
    const validator = vine.compile(userLoginSchema);
    const { email, password } = await validator.validate(body);

    const findUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!findUser) throw createError(404, "User not found");
    const isPasswordCorrect = await bcrypt.compare(password, findUser.password);
    if (!isPasswordCorrect) throw createError(400, "Wrong Password");

    const payload = {
      id: findUser.id,
      username: findUser.username,
      email: findUser.email,
      role: findUser.role,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res
      .status(200)
      .json({ message: "Login Successful", access_token: `Bearer ${token}` });
  } catch (error) {
    if (error instanceof errors.E_VALIDATION_ERROR) {
      return next(createError(400, error.messages));
    }
    next(error);
  }
};

export const getUserProfile = async (req, res, next) => {
  try {
    const user = req.user;
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
