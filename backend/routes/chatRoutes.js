import express from "express";
import { Thread } from "../models/Thread.model.js";
import { User } from "../models/User.model.js";
import { getApiResponseFromGemini } from "../utils/geminiApi.js";
import { generateChatTitle } from "../utils/titleGenerator.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { checkAuth, handleLogin, handleLogout, handleRegister } from "../controllers/auth.controller.js";

const router = express.Router();


// ----------------------- GET ALL THREADS -----------------------
router.get("/threads", async (req, res) => {
    try {
        const threads = await Thread.find({ user: req.userId }).sort({ updatedAt: -1 });
        res.status(200).json({ threads });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ----------------------- GET SINGLE THREAD -----------------------
router.get("/threads/:threadId", async (req, res) => {
    const { threadId } = req.params;
    try {
        const thread = await Thread.findOne({ threadId, user: req.userId });
        if (!thread) return res.status(404).json({ message: "Thread not found" });
        res.status(200).json({ thread });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ----------------------- DELETE THREAD -----------------------
router.delete("/threads/:threadId", async (req, res) => {
    const { threadId } = req.params;
    try {
        const thread = await Thread.findOneAndDelete({ threadId, user: req.userId });
        if (!thread) return res.status(404).json({ message: "Thread not found" });

        // Remove thread reference from user's threads array
        await User.findByIdAndUpdate(req.userId, { $pull: { threads: thread._id } });

        res.status(200).json({ message: "Thread deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ----------------------- CREATE/CHAT -----------------------
router.post("/chat", async (req, res) => {
    const { threadId, message } = req.body;
    if (!threadId || !message) return res.status(400).json({ error: "Missing required fields" });

    try {
        let thread = await Thread.findOne({ threadId, user: req.userId });

        if (!thread) {
            // Generate short AI title
            const aiTitle = await generateChatTitle(message);

            thread = new Thread({
                threadId,
                title: aiTitle,
                message: [{ role: "user", content: message }],
                user: req.userId,
            });

            await thread.save();

            // Add to user's threads
            await User.findByIdAndUpdate(req.userId, { $push: { threads: thread._id } });
        } else {
            thread.message.push({ role: "user", content: message });
        }

        // Get AI reply
        const replyFromGemini = await getApiResponseFromGemini(thread.message, "normal");
        const replyText = typeof replyFromGemini === "string" ? replyFromGemini : JSON.stringify(replyFromGemini);

        thread.message.push({ role: "model", content: replyText });
        thread.updatedAt = Date.now();
        await thread.save();

        res.status(200).json({ reply: replyText, threadTitle: thread.title });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// Authentication Routes

router.post("/check-auth", verifyToken, checkAuth);

router.post("/register", handleRegister);

router.post("/login", handleLogin);

router.post("/logout", handleLogout);

export { router };
