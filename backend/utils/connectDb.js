import mongoose from "mongoose"

export const connectDd = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL).then(() => {
            console.log("Connected to mongoose")
        })
    } catch (error) {
        console.log("Some error - ", error.message);
    }
}