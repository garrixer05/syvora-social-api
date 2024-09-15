import { PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
let prismaInstance = null;
const SECRET = process.env.MY_SECRET



export const getPrismaInstance = ()=>{
    if(!prismaInstance){
        prismaInstance = new PrismaClient();
    }
    return prismaInstance;
}
export const generateToken = (payload)=>{
    const token = jwt.sign(payload, SECRET, {
        expiresIn:"1h",
    })
    return token;
}
export const verifyToken = async (req, res, next)=>{
    try {
        const {authtoken} = req.headers;
        const {id, email} = jwt.verify(authtoken, SECRET)
        req.currUserId = id;
        req.currUserEmail = email;
        req.currUserUname = email.split("@")[0]
        next();
    } catch (error) {
        console.log(error);
        return res.send({status:false, msg:"Unauthorized access"})
    }
}
export const userCheck = async (req, res, next)=>{
    try {
        if(!req.query.userId){
            return res.send({status:false, msg:"User Id param required!"})
        }
        if (req.currUserId !== parseInt(req.query.userId)){
            return res.send({status:"false", msg:"Unauthorized! Can't update other user data."})
        }else{
            next()
        }
    } catch (error) {
        console.log(error);
           
    }
}