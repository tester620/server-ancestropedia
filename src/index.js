import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDb } from "./utils/db.js";
import reportRoutes from "./routes/report.route.js";
import relationRoutes from "./routes/relation.route.js";
import profileRoutes from "./routes/profile.route.js"

import authRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import { neogma } from "./config/neo4j.js";
import { protectRoute } from "./middleware/auth.middleware.js";

dotenv.config();
const app = express();
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/report",protectRoute, reportRoutes);
app.use("/api/relation",protectRoute, relationRoutes);
app.use("/api/profile",protectRoute,profileRoutes)

app.listen(7777, async () => {
  neogma;
  await connectDb();
  console.log("Server is listening on port", 7777);
});
