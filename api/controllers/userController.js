import Listing from "../models/listingModel.js"
import User from "../models/userModel.js"
import { errorHandler } from "../utils/error.js"
import bcryptjs from "bcryptjs"

export const test = (req, res) => {
    res.json({ message: 'hello world'})
}

export const updateUser = async(req, res, next) => {
    if(req.user.id !== req.params.id)
    return next(errorHandler(401 , 'you can only update your own account'))

    try{
        if(req.body.password){
            req.body.password = bcryptjs.hashSync(password, 10)
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,                                   // set is used to update set of items if it is available with safety
                avatar: req.body.avatar,
            }
        }, { new: true})

        const { password, ...rest} = updatedUser._doc;

        return res.status(200).json(rest)
    }
    catch(err){
      next(err)
    }
}

export const deleteUser = async(req, res, next) => {
    if(req.user.id !== req.params.id)
    return next(errorHandler(401 , 'you can only delete your own account'))

    try{
    
        const result = await User.findByIdAndDelete(req.params.id)

        if(result){
            res.clearCookie('access_token')
            return res.status(200).send({ message: "user delete successfully"})
        }
        else{
            return res.status(404).send({message: "user not found!"})
        }

    }
    catch(err){
        next(err)
    }
}

export const getUserListing = async(req, res, next) => {
    
    if(req.user.id !== req.params.id)
    return next(errorHandler(401, 'you can only view your own listings'))
    
    try{ 
        const listings = await Listing.find({ userRef:req.params.id})
        res.status(200).json(listings)
    }
    catch(error){
        next(error)
    }
}

