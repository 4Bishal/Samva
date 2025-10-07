import mongoose, { Schema } from "mongoose"

const userSchema = new Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true,
    },
    threads: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "thread"
    }],
}, { timestamps: true });


export const User = mongoose.model("user", userSchema);