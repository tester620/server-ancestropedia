import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDb } from "./utils/db.js";
import cookieParser from "cookie-parser";
import "./config/passport.js";

import { protectRoute } from "./middleware/auth.middleware.js";
import {
  authRoutes,
  folderRoutes,
  notificationRoutes,
  orderRoutes,
  profileRoutes,
  reportRoutes,
  requestRoutes,
  treeRoutes,
  userRoutes,
  personRoutes,
} from "./routes/routes.js";

dotenv.config();
const app = express();
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

app.use("/api/ping", (_, res) => {
  return res.send("Pong");
});

app.use("/api/auth", authRoutes);
app.use("/api/report", protectRoute, reportRoutes);
app.use("/api/profile", protectRoute, profileRoutes);
app.use("/api/user", protectRoute, userRoutes);
app.use("/api/user/tree", protectRoute, treeRoutes);
app.use("/api/user/tree/person", protectRoute, personRoutes);
app.use("/api/user/order", protectRoute, orderRoutes);
app.use("/api/user/folder", protectRoute, folderRoutes);
app.use("/api/user/request", protectRoute, requestRoutes);
app.use("/api/user/notification", protectRoute, notificationRoutes);

app.listen(7777, async () => {
  await connectDb();
  console.log("Server is listening on port", 7777);
});
