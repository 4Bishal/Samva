import express from "express";
import { Thread } from "../models/Thread.model.js";
import { getApiResponseFromGemini } from "../utils/geminiApi.js";
import { checkAuth, handleLogin, handleLogout, handleRegister } from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Get all threads
router.get("/threads", async (req, res) => {
    try {
        const threads = await Thread.find({}).sort({ updatedAt: -1 });
        res.status(200).json({ threads, message: "All threads fetched successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message || "Error fetching threads" });
    }
});

// Get a single thread by threadId
router.get("/threads/:threadId", async (req, res) => {
    const { threadId } = req.params;
    try {
        const thread = await Thread.findOne({ threadId });
        if (!thread) return res.status(404).json({ message: "Thread not found" });
        res.status(200).json({ thread, message: "Thread found" });
    } catch (error) {
        res.status(500).json({ error: error.message || "Error fetching thread" });
    }
});

// Delete a thread by threadId
router.delete("/threads/:threadId", async (req, res) => {
    const { threadId } = req.params;
    try {
        const thread = await Thread.findOneAndDelete({ threadId });
        if (!thread) return res.status(404).json({ message: "Thread not found" });
        res.status(200).json({ message: "Thread deleted successfully", thread });
    } catch (error) {
        res.status(500).json({ error: error.message || "Error deleting thread" });
    }
});

// Chat route
router.post("/chat", async (req, res) => {
    const { threadId, message } = req.body;
    if (!threadId || !message) return res.status(400).json({ error: "Missing required fields" });

    try {
        // Find or create thread
        let thread = await Thread.findOne({ threadId });
        if (!thread) {
            thread = new Thread({
                threadId,
                title: message,
                message: [{ role: "user", content: message }]
            });
        } else {
            thread.message.push({ role: "user", content: message });
        }

        // Get AI response (last 10 messages by default)
        const replyFromGemini = await getApiResponseFromGemini(thread.message, 10);

        // Save AI response in thread
        const replyText = typeof replyFromGemini === "string" ? replyFromGemini : JSON.stringify(replyFromGemini);
        thread.message.push({ role: "model", content: replyText });
        thread.updatedAt = Date.now();

        await thread.save();

        res.status(200).json({ reply: replyText });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message || "Something went wrong" });
    }
});



// Authentication Routes

router.post("/check-auth", verifyToken, checkAuth);

router.post("/register", handleRegister);

router.post("/login", handleLogin);


router.post("/logout", handleLogout);



export { router };
