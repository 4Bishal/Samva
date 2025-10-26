import status from "http-status";
import bcrypt from "bcryptjs";
import { OAuth2Client } from 'google-auth-library';
import { User } from "../models/User.model.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const handleRegister = async (req, res) => {
    console.log(req.body);
    const { name, email, password } = req.body;
    console.log(email, password, name);

    try {
        if (!email || !password || !name) {
            throw new Error("All Fields is required");
        }

        let isUserExists = await User.findOne({ email });
        if (isUserExists) {
            return res.status(status.BAD_REQUEST).json({
                message: "User Already Exists",
                success: false
            });
        }

        const hashedPass = await bcrypt.hash(password, 10);
        const newUser = new User({
            email,
            password: hashedPass,
            name,
            authProvider: 'local' // Set auth provider for email/password users
        });

        await newUser.save();

        // jwtToken Setup
        generateTokenAndSetCookie(res, newUser._id);

        res.status(status.CREATED).json({
            message: "New User registered Successfully",
            success: true,
            user: {
                ...newUser._doc,
                password: undefined
            }
        });

    } catch (error) {
        console.log(error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || "Something went Wrong!"
        });
    }
};

export const handleLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            throw new Error("All fields is required");
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(status.BAD_REQUEST).json({
                success: false,
                message: "Invalid Username or password"
            });
        }

        // Check if user has a password (not a Google-only user)
        if (!user.password) {
            return res.status(status.BAD_REQUEST).json({
                success: false,
                message: "This account uses Google Sign-In. Please sign in with Google."
            });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(status.UNAUTHORIZED).json({
                success: false,
                message: "Invalid Username or password"
            });
        }

        generateTokenAndSetCookie(res, user._id);

        await user.save();

        res.status(status.OK).json({
            success: true,
            message: "User logged in successfully",
            user: {
                ...user._doc,
                password: undefined
            }
        });

    } catch (error) {
        res.status(status.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message
        });
    }
};

// NEW: Google Authentication Handler
export const handleGoogleAuth = async (req, res) => {
    try {
        const { credential } = req.body;

        if (!credential) {
            return res.status(status.BAD_REQUEST).json({
                success: false,
                message: "Google credential is required"
            });
        }

        // Verify the Google token
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { sub: googleId, email, name, picture } = payload;

        // Check if user exists
        let user = await User.findOne({ email });

        if (user) {
            // User exists - check if they need Google linked
            if (!user.googleId) {
                user.googleId = googleId;
                user.profilePicture = picture;
                user.authProvider = user.authProvider === 'local' ? 'both' : 'google';
                await user.save();
            }
        } else {
            // Create new user with Google auth
            user = new User({
                name,
                email,
                googleId,
                profilePicture: picture,
                authProvider: 'google',
                // No password needed for Google users
            });
            await user.save();
        }

        // Generate JWT token and set cookie
        generateTokenAndSetCookie(res, user._id);

        res.status(status.OK).json({
            success: true,
            message: 'Google authentication successful',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                profilePicture: user.profilePicture,
                authProvider: user.authProvider
            }
        });

    } catch (error) {
        console.error('Google auth error:', error);
        res.status(status.UNAUTHORIZED).json({
            success: false,
            message: 'Google authentication failed',
            error: error.message
        });
    }
};

export const handleLogout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        });

        return res.status(status.OK).json({
            success: true,
            message: "Logged out successfully!",
        });
    } catch (error) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message,
        });
    }
};

export const checkAuth = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password");

        if (!user) {
            return res.status(status.NOT_FOUND).json({
                success: false,
                message: "User doesn't exists"
            });
        }

        res.status(status.OK).json({
            success: true,
            message: "User is Found",
            user
        });
    } catch (error) {
        console.log("Error in checkAuth - User not found!! - ", error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message
        });
    }
};