import genToken from "../config/token.js";
import UserModel from "../models/userModel.js";
import bcrypt from "bcryptjs";

export const signUp = async(req, res) => {
    try {
        const {name, email, password} = req.body;

        const existEmail = await UserModel.findOne({email})
        if(existEmail){
            return res.status(400).json({message:"Email already exists !"})
        }

        if(password.length < 6){
            return res.status(400).json({message:"Password must be at least 6 characters long"})
        }

        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password with a salt round of 10

        const user = new UserModel({name, email, password: hashedPassword});  // password = created hashed password

        const token = await genToken(user._id)

        res.cookie("token", token ,{
            httpOnly:true,
            maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
            sameSite: "None",
            secure: true
        })

        user.save();

        return res.status(201).json(user);

    } catch (error) {
        return res.status(500).json({message:"Error in SignUp", error: error.message})
    }
}

export const Login = async(req, res) => {
    try {
        const {email, password} = req.body;

        const user = await UserModel.findOne({email})
        if(!user){
            return res.status(400).json({message:"Email does not exists !"})
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(400).json({message:"Invalid password !"})
        }

        const token = await genToken(user._id)

        res.cookie("token", token ,{
            httpOnly:true,
            maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
            sameSite: "None",
            secure: true
        })

        return res.status(200).json(user);

    } catch (error) {
        return res.status(500).json({message:"Error in Login", error})
    }
}

export const Logout = async(req, res) => {
    try {
        res.clearCookie("token")
        return res.status(200).json({message:"Logged out successfully"})
    } catch (error) {
        return res.status(500).json({message:"Error in Logout", error})
    }
}
