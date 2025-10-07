import status from "http-status";
import bcrypt from "bcryptjs";
import crypto from "crypto"
import { User } from "../models/User.model.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";


export const handleRegister = async (req, res) => {
    console.log(req.body);
    const { name, email, password } = req.body;
    console.log(email, password, name)

    try {

        if (!email || !password || !name) {
            throw new Error("All Fields is required");
        }

        let isUserExists = await User.findOne({ email });
        if (isUserExists) {
            res.status(status.BAD_REQUEST).json({ message: "User Already Exists", success: false });
        }
        const hashedPass = await bcrypt.hash(password, 10);
        const newUser = await User({
            email,
            password: hashedPass,
            name
        });
        await newUser.save();
        // jwtToken Setup
        generateTokenAndSetCookie(res, newUser._id);

        res.status(status.CREATED).json({
            message: "New User registered Successfully",
            success: true,
            newUser: {
                ...newUser._doc,
                password: undefined
            }
        });


    } catch (error) {
        console.log(error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            success: false, message: error.message ||
                "Something went Wrong!"
        })
    }
}


export const handleLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            throw new Error("All fields is required")
        }

        const user = await User.findOne({ email });

        if (!user) {
            res.status(status.BAD_REQUEST).json({ success: false, message: "Invalid Username or password" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);


        if (!isPasswordCorrect) {
            res.status(status.UNAUTHORIZED).json({ success: false, message: "Invalid Username or password" });
        }

        generateTokenAndSetCookie(res, user._id);


        await user.save();

        res.status(status.OK).json({
            success: true, message: "User logged in succesfully", user: {
                ...user._doc,
                password: undefined
            }
        });

    } catch (error) {
        res.status(status.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
    }
}


export const handleLogout = async (req, res) => {
    try {
        res.clearCookie("token");
        res.status(status.OK).json({ success: true, messsage: "Logout Successfully!" })
    } catch (error) {
        res.status(status.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
    }
}
