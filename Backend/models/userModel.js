import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    assistantName: {
        type: String,
    },
    assistantImage: {   // ✅ add this field
        type: String,     // store image URL (Cloudinary URL, base64, etc.)
    },
    history: [
        { type: String }
    ]
},
    { timestamps: true }
)

const UserModel = mongoose.model("User", userSchema)
export default UserModel;