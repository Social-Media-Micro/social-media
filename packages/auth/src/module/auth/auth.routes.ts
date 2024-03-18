import express from "express";
import {
  createUserBodyValidator,
  createUserSessionBodyValidator,
  refreshAccessTokenViaRefreshTokenBodyValidator,
  verifyEmailAddressViaOtpBodyValidator,
} from "./auth.schema";
import AuthController from "./auth.controller";
import JoiValidator from "../../utils/joiValidator";
import AuthMiddleware from "../../middleware/authMiddleware";

const authRoute = express.Router();
const authController = new AuthController();
const joiValidator = new JoiValidator();
const authMiddleware = new AuthMiddleware();

authRoute.post(
  "/create-user",
  joiValidator.validate(createUserBodyValidator, "body"),
  authController.createUser,
);
authRoute.post(
  "/create-session",
  joiValidator.validate(createUserSessionBodyValidator, "body"),
  authController.createSession,
);
authRoute.put(
  "/refresh-access-token",
  joiValidator.validate(refreshAccessTokenViaRefreshTokenBodyValidator, "body"),
  authController.refreshAccessTokenViaRefreshToken,
);
authRoute.put("/logout", authMiddleware.protect, authController.logout);
authRoute.put(
  "/verify-email-address-via-otp",
  authMiddleware.protect,
  joiValidator.validate(verifyEmailAddressViaOtpBodyValidator, "body"),
  authController.verifyEmailAddressViaOtp,
);

export default authRoute;
