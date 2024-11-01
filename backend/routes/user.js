//  start writing your code from here
import { Router } from "express";
import jwt from 'jsonwebtoken'
import {userValidator} from '../validateBody.js'
import userMiddleware from '../middleware/user.js'
import { User } from "../db/index.js";


const userRouter = Router()

userRouter.post('/signup', async(req,res)=>{
    const bodyToValidate = req.body
    const isValidated = userValidator.safeParse(bodyToValidate)
    if(!isValidated.success){
        return res.json({
            msg: "Inputs are not valid, enter inputs in correct format!"
        })
    }
    const {username,password} = bodyToValidate
    try{
        const existingUser = await User.findOne({username})
        if(!existingUser){
            await User.create({
                username,password
            })
            const token = jwt.sign({username}, process.env.JWT_SECRET,{expiresIn: '1h'})
            res.json({
                msg:"User created successfully!",
                token
            })
        }else{
            res.json({
                msg: "User Already exist!"
            })
        }
    }catch(err){
        res.json({
            msg:"Error during user creation"
        })
    }
})

userRouter.post('/signin', userMiddleware,async (req,res)=>{
    const {username, password} = req.body
    try{
        const existingUser = await User.findOne({
            username,password
        })
        if(existingUser){
            res.json({
                msg: "User loggedIn!"
            })
        }else{
            res.json({
                msg: "User does not exist!"
            })
        }
    }catch(err){
        res.json({
            msg: "Error during logging user",
            err
        })
    }
})

export default userRouter
