import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true
        },
        userEmail: {
            type: String,
            required: true
        },
        otp: {
            type: String,
            required: true,
            unique: true
        },
        expires: {
            type: Date,
            required: true
        }
    }
)

const Otp = mongoose.model("Otp", otpSchema);

export default Otp;