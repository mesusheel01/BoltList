import { Todo, User } from "../db/index.js";
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

        // Streak Logic
        const user = await User.findById(req.userId);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize to midnight

        let lastTaskDate = user.lastTaskDate ? new Date(user.lastTaskDate) : null;
        if (lastTaskDate) lastTaskDate.setHours(0, 0, 0, 0);

        if (!lastTaskDate) {
            // First ever task
            user.streak = 1;
        } else if (lastTaskDate.getTime() === today.getTime()) {
            // Already did a task today - streak stays same
        } else if (today.getTime() - lastTaskDate.getTime() === 86400000) {
            // Last task was yesterday (difference is 1 day in ms)
            user.streak += 1;
        } else {
            // Missed a day or more
            user.streak = 1;
        }

        user.lastTaskDate = new Date();
        await user.save();

        res.json({
            msg: "Todo created succesfully",
            newTodo,
            streak: user.streak
        })
    } catch (err) {
        res.status(500).json({
            msg: 'Error during creating Todo!'
        })
    }
})

todoRouter.get('/', async (req, res) => {
    try {
        const todos = await Todo.find({ userId: req.userId }).sort({ _id: -1 }) // Sorted for convenience
        const user = await User.findById(req.userId);
        res.json({
            todos: todos,
            streak: user ? user.streak : 0
        })
    } catch (error) {
        res.status(500).json({
            msg: "Error fetching todos!"
        })
    }
})


todoRouter.put('/:id', async (req, res) => {
    const { id } = req.params
    const payload = req.body

    console.log(payload)
    try {
        // Security: Verify the todo belongs to the authenticated user
        const todo = await Todo.findOne({ _id: id, userId: req.userId })

        if (!todo) {
            return res.status(404).json({
                msg: "Todo not found or you don't have permission to update it"
            })
        }

        await Todo.updateOne({ _id: id, userId: req.userId }, { $set: payload })
        res.json({
            msg: `Todo ${payload.completed ? `Todo marked as ${payload.completed ? "completed" : "not completed"}` : "Todo updated successfully!"}!`
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
        // Security: Only delete if the todo belongs to the authenticated user
        const todo = await Todo.deleteOne({ _id: id, userId: req.userId })

        if (todo.deletedCount === 0) {
            return res.status(404).json({
                msg: "Todo not found or you don't have permission to delete it"
            })
        }

        res.status(200).json({
            msg: "Todo deleted successfully!"
        })
    } catch (err) {
        res.status(500).json({
            msg: "Error deleting todo!"
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
