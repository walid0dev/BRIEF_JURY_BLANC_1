import express, {} from "express";
import env from "./config/env.js";
import morgan from "morgan";
import { globalErrorHandler } from "./shared/middlewares/global.js";
import { NotFoundError } from "./utils/errors.js";
import { connectDB } from "./config/db.js";
import authRoutes from "./modules/auth/routes.js";
import supplierRoutes from "./modules/supplier/routes.js";
import invoiceRoutes from "./modules/invoice/routes.js";
const server = express();
if (env.NODE_ENV === "development") {
  server.use(morgan("dev"));
}
server.use(express.json());
server.use("/api/auth", authRoutes);
server.use("/api/suppliers", supplierRoutes);
server.use("/api/invoices", invoiceRoutes);
server.get("/api/health", (_, res) => {
  res.status(200).json({ status: "ok" });
});
server.use((_, __, next) => {
  next(new NotFoundError("Route not found"));
});
server.use(globalErrorHandler);
server.listen(env.PORT, async () => {
  await connectDB();
  console.log(`Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
});
