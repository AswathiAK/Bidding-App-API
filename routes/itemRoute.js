import express from "express";
import { authenticate, authorize } from "../middlewares/authorization.js";
import upload from "../middlewares/multer.js";

import {
  createNewItem,
  deleteItem,
  getAllItems,
  getSingleItem,
  updateItem,
} from "../controllers/itemController.js";

const router = express.Router();

router.post("/", authenticate, upload.single("imageUrl"), createNewItem);
router.put(
  "/:id",
  authenticate,
  authorize,
  upload.single("imageUrl"),
  updateItem
);
router.delete("/:id", authenticate, authorize, deleteItem);

router.get("/", getAllItems);
router.get("/:id", getSingleItem);

export default router;
