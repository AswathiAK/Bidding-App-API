import express from "express";
import { placeBid, getBidsForItem } from "../controllers/bidController.js";
import { authenticate } from "../middlewares/authorization.js";

const router = express.Router();

router.post("/:itemId/bids", authenticate, placeBid);
router.get("/:itemId/bids", getBidsForItem);

export default router;
