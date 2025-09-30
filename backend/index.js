import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDd } from "./utils/connectDb.js";
import { router as chatRoutes } from "./routes/chatRoutes.js";

dotenv.config();

const PORT = process.env.PORT || 8000;
const app = express();

app.use(express.json());
app.use(cors());

app.use("/api", chatRoutes);

app.listen(PORT, async () => {
    console.log(`Server listening at port ${PORT}`);
    await connectDd();
});






