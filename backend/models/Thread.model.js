import mongoose, { Schema } from "mongoose"

const MessageSchema = new Schema({
    role: {
        type: String,
        enum: ["user", "model"],
        require: true
    },
    content: {
        type: String,
        require: true
    },
    timeStamp: {
        type: Date,
        default: Date.now
    }
});



const ThreadSchema = new Schema({
    threadId: {
        type: String,
        require: true,
        unique: true
    },
    title: {
        type: String,
        default: "New Chat"
    },
    message: [MessageSchema],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        require: true
    }
    ,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});


export const Thread = mongoose.model("thread", ThreadSchema);