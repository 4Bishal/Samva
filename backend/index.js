import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDd } from "./utils/connectDb.js";
import { router as chatRoutes } from "./routes/chatRoutes.js";
import cookieParser from "cookie-parser"

dotenv.config();

const PORT = process.env.PORT || 8000;
const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());


app.use("/api", chatRoutes);

app.listen(PORT, async () => {
    console.log(`Server listening at port ${PORT}`);
    await connectDd();
});






