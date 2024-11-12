import { Router } from "express";
import jwt from 'jsonwebtoken'
import {signUpValidator, signInValidator} from '../validateBody.js'
import { User } from "../db/index.js";
import bcrypt from 'bcrypt'

const userRouter = Router()

userRouter.post('/signup', async(req,res)=>{
    const bodyToValidate = req.body
    bodyToValidate.email = bodyToValidate.email.trim()
    bodyToValidate.username = bodyToValidate.username.trim()
    
    const isValidated = signUpValidator.safeParse(bodyToValidate)
    if(!isValidated.success){
        return res.json({
            msg: "Inputs are not valid, enter inputs in correct format!"
        })
    }
    const {username, email, password} = bodyToValidate

    try{

        const existingUser = await User.findOne({email})
        if(existingUser){
            return res.status(409).json({
                msg: "User already exists!"
            })
        }
        const saltRounds = 12
        const hashedPass = await bcrypt.hash(password, saltRounds)
        const newUser = await User.create({
            username,
            email,
            password:hashedPass
        })
        const token = jwt.sign({userId: newUser._id, username}, process.env.JWT_SECRET, {expiresIn: '1h'})
        res.status(201).json({
            msg: "User created successfully!",
            token
        })
    }catch(err){
        res.json({
            msg:"Error during user creation"
        })
    }
})

userRouter.post('/signin', async (req, res) => {
    const bodyToValidate = req.body;
    bodyToValidate.username = bodyToValidate.username.trim()
    const isValidated = signInValidator.safeParse(bodyToValidate);
    if (!isValidated.success) {
        return res.status(400).json({
            msg: "Inputs are not valid, enter inputs in the correct format!"
        });
    }

    const { username, password } = bodyToValidate;

    try {

        const existingUser = await User.findOne({ username });
        if (!existingUser) {
            return res.status(404).json({
                msg: "User does not exist. Please sign up first."
            });
        }

        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                msg: "Invalid password!"
            });
        }

        const token = jwt.sign({userId: existingUser._id, username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({
            msg: "User signed in successfully!",
            token
        });
    } catch (err) {
        res.status(500).json({
            msg: "Error during signing in"
        });
    }
});


export default userRouter
