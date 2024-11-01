import mongoose from 'mongoose';
import zod from 'zod'


const userValidator = zod.object({
    username: zod.string(),
    password: zod.string()
})

const todoValidator = zod.string();


export {userValidator, todoValidator}
