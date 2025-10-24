import jwt from "jsonwebtoken"


export const generateTokenAndSetCookie = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "2d",
    })
    console.log(token);

    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("token", token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        maxAge: 2 * 24 * 60 * 60 * 1000,
    })

    console.log("Token set")

    return token;
}
