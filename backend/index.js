// start writing from here
import express from 'express'
import dotenv from 'dotenv'
import userRouter from './routes/user.js'
import todoRouter from './routes/todo.js'
import cors from 'cors'
import './db/index.js'
dotenv.config()

const app = express()

app.use(express.json())
app.use(cors({
    origin: ['https://bolt-list.vercel.app', 'http://localhost:5173/'],
    methods: '*',
    allowedHeaders: '*'
}))

//test route
app.get('/', (req, res) => {
    res.send("Hello!")
})
//routes
app.use('/user', userRouter)
app.use('/todo', todoRouter)

app.listen(process.env.PORT, () => {
    console.log(`Server is listening at http://localhost:${process.env.PORT}`)
})
