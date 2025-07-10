import express from "express";
import dotenv from "dotenv";
import cors from "cors"
import { connectDb } from "./utils/db.js";
import session from "express-session";
import passport from "passport";
import authRoutes from "./routes/auth.route.js"
import cookieParser from "cookie-parser";


dotenv.config()
const app = express();
const corsOptions = {
    origin:"http://localhost:3000",
    credentials:true,
}

app.use(cors(corsOptions));

app.use(express.json())
app.use(passport.initialize());
app.use(passport.session());

app.use(cookieParser())

app.use(session({
  secret: process.env.SESSION_SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRoutes);



app.listen(7777,async ()=>{
    await connectDb();
})