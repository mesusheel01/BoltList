import { Todo } from "../db/index.js";
import Router from 'express'
import { todoValidator } from "../validateBody.js";
import authenticateUser from "../middleware/user.js";

const todoRouter = Router()
todoRouter.use(authenticateUser)

todoRouter.post('/', async(req,res)=>{
    const todoTitle = req.body.title;
    const  isValidated = todoValidator.safeParse(todoTitle)
    if(!isValidated.success){
        return res.json({
            msg: 'Input correct inputs!'
        })
    }
    try{
        const newTodo = await Todo.create({
            userId: req.userId,
            title: todoTitle,
            completed: false
        })
        res.json({
            msg: "Todo created succesfully",
            newTodo
        })
    }catch(err){
        res.status(500).json({
            msg: 'Error during creating Todo!'
        })
    }
})

todoRouter.get('/', async(req,res)=>{
    try {
        const todos = await Todo.find({userId: req.userId})
        res.json({
            todos: todos
        })
    } catch (error) {
        res.status(500).json({
            msg: "Error fetching todos!"
        })
    }
})

todoRouter.put('/:id', async(req,res)=>{
    const {id} = req.params
    const completePayload = req.body
    if(typeof completePayload.completed === 'undefined'){
        return res.status(400).json({
            msg:"you must provide a completed status"
        })
    }
    try {

        await Todo.updateOne({_id: id}, {completed: completePayload.completed})
        res.json({
            msg: "todo marked as completed!"
        })
    } catch (error) {
        res.status(500).json({
            msg: "Error updating todo.",
        })
    }
})

export default todoRouter
