import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: "https://images.app.goo.gl/JhmXSuZ3nSGTYeKW6"
    }
}, {timestamps: true})

const User = mongoose.model('User' , userSchema) // always create singlurar with first letter uppercase like User

export default User;