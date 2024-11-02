//  start writing your code from here
import { Router } from "express";
import jwt from 'jsonwebtoken'
import {userValidator} from '../validateBody.js'
import { User } from "../db/index.js";
import bcrypt from 'bcrypt'

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
        if(existingUser){
            return res.status(409).json({
                msg: "User already exists!"
            })
        }
        const saltRounds = 12
        const hashedPass = await bcrypt.hash(password, saltRounds)
        console.log('hashedpass: ', hashedPass)
        //create the new user
        const newUser = await User.create({
            username,
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
    const isValidated = userValidator.safeParse(bodyToValidate);
    if (!isValidated.success) {
        return res.status(400).json({
            msg: "Inputs are not valid, enter inputs in the correct format!"
        });
    }

    const { username, password } = bodyToValidate;

    try {
        // Check if user exists
        const existingUser = await User.findOne({ username });
        if (!existingUser) {
            return res.status(404).json({
                msg: "User does not exist. Please sign up first."
            });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                msg: "Invalid password!"
            });
        }

        // Create and return token
        const token = jwt.sign({userId: existingUser._id, username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({
            msg: "User signed in successfully!",
            token
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            msg: "Error during signing in"
        });
    }
});


export default userRouter
