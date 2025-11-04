import uploadOnCloudinary from "../config/cloudinary.js";
import UserModel from "../models/userModel.js";
import geminiResponse from "../gemini.js";
import moment from "moment";

export const getCurrentUser = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await UserModel.findById(userId).select("-password")  // password exclude krke dega
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: "getCurrentUser Error", error })
    }
}

export const updateAssistant = async (req, res) => {
    try {
        const { assistantName, imageUrl } = req.body;
        let assistantImage = null;

        if (req.file) {
            assistantImage = await uploadOnCloudinary(req.file.path);
        } else {
            assistantImage = imageUrl;
        }
        const user = await UserModel.findByIdAndUpdate(req.userId, { assistantName, assistantImage }, { new: true }).select("-password");
        console.log(user);
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: "updateAssistant Error", error })
    }
}

export const askToAssistant = async (req, res) => {
    try {
        const { command } = req.body;
        const user = await UserModel.findById(req.userId);
        user.history.push(command);
        user.save();
        const userName = user.name;
        const assistantName = user.assistantName;

        const result = await geminiResponse(command, assistantName, userName);
        const jsonMatch = result.match(/{[\s\S]*}/);
        if (!jsonMatch) {
            return res.status(500).json({ message: "Sorry i can't understand " });
        }
        const gemResult = JSON.parse(jsonMatch[0]);
        const type = gemResult.type

        switch (type) {
            case "get-date":
                return res.json({
                    type,
                    userInput: gemResult.userInput,
                    response: `Today's date is ${moment().format("YYYY-MM-DD")}`
                });
            case "get-time":
                return res.json({
                    type,
                    userInput: gemResult.userInput,
                    response: `Current time is ${moment().format("hh:mm A")}`
                });
            case "get-day":
                return res.json({
                    type,
                    userInput: gemResult.userInput,
                    response: `Today's day is ${moment().format("dddd")}`
                });
            case "get-month":
                return res.json({
                    type,
                    userInput: gemResult.userInput,
                    response: `Current month is ${moment().format("MMMM")}`
                });

            case 'google-search':

            case 'youtube-search':

            case 'youtube-play':

            case 'general':

            case "calculator-open":

            case "instagram-open":

            case "facebook-open":

            case "weather-show":

                return res.json({
                    type,
                    userInput: gemResult.userInput,
                    response: gemResult.response,
                });

                default:
                    return res.status(500).json({ message: "Sorry i didn't understand that ! " });
                

    }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "askToAssistant Error", error });
}
}