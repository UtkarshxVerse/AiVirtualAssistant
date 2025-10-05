import jwt from 'jsonwebtoken';

const isAuth =async (req, res, next) => {     // req verify ho jati h toh next usse server k ps le jata h
    try {
        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({message:"Unauthorized, token not verified"})
        }
        const verifyToken = await jwt.verify(token, process.env.JWT_SECRET);
        req.userId = verifyToken.userId;
        next();

    } catch (error) {
        res.status(401).json({message:"isAuth Error", error})
    }
}

export default isAuth;