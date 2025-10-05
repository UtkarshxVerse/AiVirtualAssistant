import express from 'express';
import { Login, Logout, signUp } from '../controllers/authController.js';

const authRouter = express.Router();

authRouter.post("/signup", signUp);
authRouter.post("/signin", Login);
authRouter.get("/logout", Logout);  //get bcoz we dont want to take any data from user

export default authRouter;