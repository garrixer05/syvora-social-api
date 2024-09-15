import { PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as argon from 'argon2';
import { generateToken } from '../utils/HelperFuncs.js';

const prisma = new PrismaClient();

export const registerUser = async (req, res)=>{
    try {
        const {email, password} = req.body;
        const hash = await argon.hash(password);

        await prisma.user.create({
            data:{
                email,
                hash
            }
        })
        return res.send({status:"OK", msg:"User Created. Please Login now"})
        
    } catch (error) {
        if (error){
            if(error instanceof PrismaClientKnownRequestError){
                if (error.code === "P2002"){
                    return res.send({status:false, msg:"Email already taken. Please sign in or regiter with another email."})
                }
            }
            console.log(error);
        }
    }
}
export const loginUser = async (req, res)=>{
    try {
        const {email, password} = req.body;
        const user = await prisma.user.findUnique({
            where:{
                email:email
            }
        })
        if(!user){
            return res.send({status:false, msg:"User not found!"});
        }
        let pwMatches = await argon.verify(user.hash, password);
        if(!pwMatches){
            return res.send({status:false, msg:"Incorrect Password"});
        }
        const token = generateToken(user);
        delete user.hash;
        return res.send({
            status:true,
            user,
            accessToken:token
        })
    } catch (error) {
        console.log(error);        
    }
}

