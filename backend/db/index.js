//  start writing from here
import mongoose from 'mongoose'
import dotenv from 'dotenv';
dotenv.config()


mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('Connected to DB'))
.catch(err => console.log("Error connecting to DB:", err));


const todoModel = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    completed: {
        type: Boolean,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
////Refrencing the user id with todo table will create a mogodb population where every user will have his own refrence id and with that id  his own particular table and then .populate() mehtod can be used to fetch particular user's todo lists
// refrencing the user ID": In MongoDB, each todo document stores a userId field as a reference to a document in the User collection.
// Not creating "a particular table for each user": MongoDB does not create separate tables (or collections) for each user. Instead, todos for all users are stored in a single collection (todos), and each todo document has a userId field that associates it with a user.
// // Using .populate(): By referencing the User model with userId in each todo, we can use .populate() to load associated user details when querying todos, if user-specific data is required.
})


const userModel = new mongoose.Schema({
    username: String,
    email: {
        type: String,
        unique: true
    },
    password: String,
})

const Todo = mongoose.model('Todos', todoModel)
const User = mongoose.model('User', userModel)

export {Todo, User}
