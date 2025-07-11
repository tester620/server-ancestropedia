import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDb } from "./utils/db.js";
import reportRoutes from "./routes/report.route.js"

import passport from "passport";
import authRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import { neogma } from "./config/neo4j.js";

dotenv.config();
const app = express();
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

// app.use(passport.initialize());
// app.use(passport.session());

app.use("/api/auth", authRoutes);
app.use("/api/report",reportRoutes)

app.listen(7777, async () => {
  neogma;
  await connectDb();
  console.log("Server is listening on port",7777)
});
