import express from "express";
import dotenv from "dotenv";
import cors from "cors"
import { connectDb } from "./utils/db.js";


dotenv.config()
const app = express();
const corsOptions = {
    origin:"http://localhost:3000",
    credentials:true,
}

app.use(cors(corsOptions));



app.listen(7777,async ()=>{
    await connectDb();
})