//  start writing from here

import jwt  from 'jsonwebtoken'


const userMiddleware = (req,res,next)=>{
    const token = req.headers.authorization
    try{
        jwt.verify(token, process.env.JWT_SECRET, (err,user)=>{
            if(err){
                return res.status(403).json({
                    message: 'Forbidden: Invalid Token'
                })
            }
            req.userId = user.userId
            next()
        })
    }catch(err){
        res.json({
            msg: 'Error during authenticating user!'
        })
    }
}

export default userMiddleware
