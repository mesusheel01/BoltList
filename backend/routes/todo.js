import { Todo } from "../db/index.js";
import Router from 'express'
import { todoValidator } from "../validateBody.js";
import authenticateUser from "../middleware/user.js";

const todoRouter = Router()
todoRouter.use(authenticateUser)

todoRouter.post('/', async (req, res) => {
    const todoTitle = req.body.title;
    const isValidated = todoValidator.safeParse(todoTitle)
    if (!isValidated.success) {
        return res.json({
            msg: 'Input correct inputs!'
        })
    }
    try {
        const newTodo = await Todo.create({
            userId: req.userId,
            title: todoTitle,
            completed: false
        })
        res.json({
            msg: "Todo created succesfully",
            newTodo
        })
    } catch (err) {
        res.status(500).json({
            msg: 'Error during creating Todo!'
        })
    }
})

todoRouter.get('/', async (req, res) => {
    try {
        const todos = await Todo.find({ userId: req.userId })
        res.json({
            todos: todos
        })
    } catch (error) {
        res.status(500).json({
            msg: "Error fetching todos!"
        })
    }
})

todoRouter.put('/:id', async (req, res) => {
    const { id } = req.params
    const completePayload = req.body

    try {

        await Todo.updateOne({ _id: id }, { completed: completePayload.completed })
        res.json({
            msg: "todo marked as completed!"
        })
    } catch (error) {
        res.status(500).json({
            msg: "Error updating todo.",
        })
    }
})

// added delete route
todoRouter.delete('/:id', async (req, res) => {
    const id = req.params.id
    try {
        const todo = await Todo.deleteOne({ _id: id })
        if (todo) {
            console.log(todo._id)
            res.status(200).json({
                msg: "Todo deleted successfully!"
            })
        } else {
            res.json({
                msg: "Todo doesn't exist"
            })
        }
    } catch (err) {
        res.json({
            msg: "Error fetching todo with the given id!"
        })
    }
})

//delete all todos realted to user
todoRouter.delete("", async (req, res) => {
    const userId = req.userId
    try {
        const todos = await Todo.deleteMany({ userId: userId })
        res.json({
            msg: "All todos deleted successfully!"
        })
    } catch (error) {
        res.status(500).json({
            msg: "Error deleting todos!"
        })
    }
})

export default todoRouter
