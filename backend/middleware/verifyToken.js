import status from "http-status";
import jwt from "jsonwebtoken"


export const verifyToken = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token)
        return res.status(status.UNAUTHORIZED).json({ success: false, message: "Unauthorised - token not found" });

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            res.status(status.UNAUTHORIZED).json({ success: false, message: "Unauthoriised - token is invalid" });
        }

        req.userId = decoded.userId;
        console.log("from verify token-", req.userId)

        next();

    } catch (error) {
        console.log("Error in Verifying Token - ", error)
        res.status(status.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });

    }

}
