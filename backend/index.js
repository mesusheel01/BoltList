// start writing from here
import express from 'express'
import dotenv from 'dotenv'
import userRouter from './routes/user.js'
import todoRouter from './routes/todo.js'
import cors from 'cors'
import './db/index.js'
import rateLimit from 'express-rate-limit'
dotenv.config()

const app = express()
const limiter = rateLimit({
    windowMs: 60*200,
    max: 5,
    msg: "Too many requests from this IP, please try again after a minute!"
})

app.use(express.json())
app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: '*',
    allowedHeaders: '*'
}))

app.use(limiter)
//test route
app.get('/', (req, res) => {
    res.send("Hello!")
})
//routes
app.use('/user', userRouter)
app.use('/todo', todoRouter)

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is listening at http://localhost:${process.env.PORT|| 3000}`)
})
