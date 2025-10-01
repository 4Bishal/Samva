import express from "express"
import { Thread } from "../models/Thread.model.js";
import { getApiResposneFromGemini } from "../utils/geminiApi.js";


const router = express.Router();


router.get("/threads", async (req, res) => {

    try {
        const threads = await Thread.find({}).sort({ updatedAt: -1 });
        if (!threads) {
            throw new Error("No Thread Present")
        }
        res.status(200).json({ threads: threads, message: "All Threads Have been sent successfully!!" });
    } catch (error) {
        res.status(500).json({ error: error.message || "No Thread Present" });
    }
})

router.get("/threads/:threadId", async (req, res) => {
    const { threadId } = req.params;

    try {
        const thread = await Thread.findOne({ threadId });

        if (!thread) {
            return res.status(404).json({ message: "Thread not found" });
        }

        res.status(200).json({ message: "thread found", thread: thread });
    } catch (error) {
        res.status(500).json({ error: error.message || "Thread not found!" });
    }
})


router.delete("/threads/:threadId", async (req, res) => {
    const { threadId } = req.params;
    try {
        console.log(threadId);
        const thread = await Thread.findOneAndDelete({ threadId });
        console.log(thread);
        if (!thread) {
            return res.status(404).json({ message: "Thread not found" });
        }

        res.status(200).json({ message: "thread deleted successfully", thread: thread });
    } catch (error) {
        res.status(500).json({ error: error.message || "Thread not found!" });
    }

})

router.post("/chat", async (req, res) => {
    const { threadId, message } = req.body;
    if (!message || !threadId) {
        res.status(400).json({ error: "missing required fields" });
    }
    try {
        let thread = await Thread.findOne({ threadId });

        if (!thread) {
            thread = new Thread({
                threadId,
                title: message,
                message: [{ role: "user", content: message }]
            })
        } else {
            thread.message.push({ role: "user", content: message })
        }

        const replyFormGemini = await getApiResposneFromGemini(message);

        thread.message.push({ role: "model", content: replyFormGemini });

        thread.updatedAt = Date.now();

        await thread.save();

        res.status(200).json({ reply: replyFormGemini });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message || "Something went wrong" });
    }
})

// router.post("/test", async (req, res) => {
//     try {
//         const newThread = await Thread({
//             threadId: "123avsdss",   
//             title: "Thread 2"
//         });
//         await newThread.save();
//         res.status(200).json({ message: "New Thread Created!!" });
//     } catch (error) {
//         res.status(500).json({ error: `Some error ocuured craeted a thread - ${error.message}` })
//     }

// })

export { router }

