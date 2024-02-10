import User from "../models/userModel.js"
import bcryptjs from "bcryptjs"; // it is package to encrypt and decrypt the password
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signUp = async(req, res , next) => {
    const { username, email, password } = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10)
    const newUser = new User({ username , email, password: hashedPassword});
    try{
        await newUser.save();
        res.status(201).json("new user added successfully")
    }
    catch(error){
        next(error)
    }
}

export const signIn = async(req, res, next) => {
    const { email , password } = req.body
    try{
        const validateUser = await User.findOne({ email })
        if(!validateUser) return next(errorHandler(404 , 'user not found'));
        const validatePassword = bcryptjs.compareSync(password, validateUser.password)
        if(!validatePassword) return next(errorHandler(401, 'invalid credentials'));
        // we have to pass something unique to sign , we can pass id because using id
        // we can't able to find out user's email or password
        const token = jwt.sign({ id:validateUser._id} , process.env.JWT_SECRET)
        // it will create token as mixture of userid and our jwt secret token
  
        // we don't need to send password so we can destructure the rest
        const { password: pass , ...rest } = validateUser._doc
        console.log("token" , token)

        res.cookie('access_token' , token , { httponly: true })
        .status(200)
        .json(rest);
    }
    catch(error){
        next(error)
    }

}

export const googleConnect = async(req, res, next) => {
    try{
        // we try to sign in using google, we are passing google mail to check whether 
        // email is registered or not
        const validateUser = await User.findOne({ email: req.body.email})
        if(validateUser){
         // if the user is present we will create jwt token and pass the response to user
         const token = jwt.sign({ id:validateUser._id} , process.env.JWT_SECRET)
         
         // we don't need to send password so we can destructure the rest
         const { password: pass , ...rest } = validateUser._doc

         res.cookie('access_token' , token , { httponly: true })
        .status(200)
        .json(rest);
        }
        else{
            // if the user is not there we need to create a user

            const randomPassword = Math.random().toString(36).slice(-8) 
            // check the line no 7 inorder to create new user we need to set a password, but the google sign in 
            // won't give password so we need to create random password and hash it and send it to db
            
            const hashedPassword = bcryptjs.hashSync(randomPassword, 10)
            
            // we can't store the username with gap, so we are removing the gap and we are adding 4 random letter
            // other wise we will end up having duplicate username error
            const newUser = new User({ username:req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4) , 
            email:req.body.email, password: hashedPassword , avatar: req.body.photo});
            
            await newUser.save(); 
            
            const token = jwt.sign({ id:newUser._id} , process.env.JWT_SECRET)
            const { password: pass , ...rest } = newUser._doc
            
            res.cookie('access_token' , token , { httponly: true })
            .status(200)
            .json(rest);
        }

    }
    catch(error){
        next(error)
    }

}


export const signOut = async(req, res, next) => {
    try{
      res.clearCookie("access_token")
      res.status(200).send({ message: "user has been logged out!"})
    }
    catch(error){
        next(error)
    }
}