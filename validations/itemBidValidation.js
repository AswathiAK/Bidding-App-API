import vine from "@vinejs/vine";
import { CustomErrorReporter } from "./customErrorReport.js";

// Custom error report
vine.errorReporter = () => new CustomErrorReporter();

export const itemSchema = vine.object({
  name: vine.string().minLength(2).maxLength(200),
  description: vine.string(),
  startingPrice: vine.number().positive(),
  currentPrice: vine.number().positive().optional(),
  endTime: vine.date(),
});

export const bidSchema = vine.object({
  bidAmount: vine.number().positive(),
});
