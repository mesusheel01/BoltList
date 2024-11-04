import zod from 'zod'


const signUpValidator = zod.object({
    username: zod.string().min(6),
    email: zod.string().email(),
    password: zod.string().min(6)
})
const signInValidator = zod.object({
    username: zod.string(),
    password: zod.string().min(6)
})

const todoValidator = zod.string();


export {signUpValidator,signInValidator, todoValidator}
