import express from "express";
import dotenv from "dotenv";
import { Database } from "./utils/dbConnection";
import router from "./router";
import path from "path";
import emailService from "./utils/emailService";
import fileUpload from "express-fileupload";
import logger from "./utils/logger";
import setupGlobalCustomMiddleware from "./middleware";
import { kafkaWrapper } from "./kafkaWrapper";
dotenv.config({
  path: path.resolve(process.cwd(), "/.env"),
});
const PORT = process.env.PORT ?? 4000;

// database connection
const db = new Database("mongodb://auth-mongo-srv:27017/auth");
db.connect();

// email service
void emailService.init();
void emailService.verifyConnection();

const app = express();
app.use(express.json());
app.use(express.static(path.join(process.cwd(), "./public")));

// Setup custom middleware
setupGlobalCustomMiddleware(app);

// Middleware to parse form data with express-fileupload
app.use(fileUpload());

app.use((_req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS",
  );
  next();
});

app.get("/api/auth/health-check", (_req, res) => {
  res.sendSuccess200Response(
    "Yay auth service is running successfully!🚀",
    null,
  );
});

// routes
router.forEach((route) => {
  app.use(`/api/auth/v1${route.prefix}`, route.router);
});
app.use("/*", (_req, res) => {
  res.sendNotFound404Response("Route not found", { msg: "Invalid route" });
});
app.listen(PORT, () => {
  kafkaWrapper.connect("auth-service");
  logger.info(`Server is running 🚀🚀🚀🚀 http://localhost:${PORT}`);
});
