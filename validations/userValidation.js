import vine from "@vinejs/vine";
import { CustomErrorReporter } from "./customErrorReport.js";

// Custom error report
vine.errorReporter = () => new CustomErrorReporter();

export const userRegisterSchema = vine.object({
  username: vine.string().minLength(2).maxLength(200),
  email: vine.string().email(),
  password: vine.string().minLength(6).maxLength(32),
});

export const userLoginSchema = vine.object({
  email: vine.string().email(),
  password: vine.string(),
});
