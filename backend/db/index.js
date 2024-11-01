//  start writing from here
import mongoose from 'mongoose'
import dotenv from 'dotenv';
dotenv.config()


mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('Connected to DB'))
.catch(err => console.log("Error connecting to DB:", err));


const todoModel = new mongoose.Schema({
    userId: mongoose.Schema.ObjectId,
    title: String,
    completed: Boolean
})
const userModel = new mongoose.Schema({
    username: String,
    password: String,
})

const Todo = mongoose.model('Todos', todoModel)
const User = mongoose.model('User', userModel)

export {Todo, User}
