import UserModel from "../models/userModel.js";

export const getCurrentUser = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await UserModel.findById(userId).select("-password")  // password exclude krke dega
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({message:"getCurrentUser Error", error})
    }
}