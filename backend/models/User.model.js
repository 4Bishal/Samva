import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: false, // Make it optional for Google OAuth users
    },
    profilePicture: {
        type: String,
        default: null
    },
    // Google OAuth specific fields
    googleId: {
        type: String,
        unique: true,
        sparse: true // Allows null values and still maintains uniqueness
    },
    authProvider: {
        type: String,
        enum: ['local', 'google', 'both'], // Track how user signed up
        default: 'local'
    },
    threads: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "thread"
    }],
}, { timestamps: true });

export const User = mongoose.models.user || mongoose.model("user", userSchema);