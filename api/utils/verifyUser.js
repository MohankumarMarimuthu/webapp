import { errorHandler } from "./error.js";
import jwt from "jsonwebtoken";


export const verifyUser = (req, res, next) => {
    if(!req.cookies.access_token) return next(errorHandler(401 , 'Unauthorized'))
    
    jwt.verify(req.cookies.access_token, process.env.JWT_SECRET , (err, user) => {
        if(err) return next(errorHandler(403, 'forbidden'));
        req.user = user;
        next();
    });
}