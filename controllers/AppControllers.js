import { PrismaClient } from "@prisma/client"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import {renameSync} from 'fs';
const prisma = new PrismaClient();


export const createProfile = async(req, res)=>{
    try {
        
        const {firstName, lastName, userId} = req.body;
        if(req?.currUserId !== parseInt(userId)){
            return res.send({status:false, msg:"Unauthorized. Cannot change other users's profile."})
        }
        if(req.file){
            let profilePicture = "uploads/images/profilePictures/"+userId+"."+req.file.originalname.split('.').pop();
            renameSync(req.file.path, profilePicture);
            const userProfile = await prisma.profile.create({
                data:{
                    firstName,
                    lastName,
                    profilePicture,
                    userId:parseInt(userId)
                }
            });
            return res.send({status:true, msg:"Profile created!", profile:userProfile})
        }else{
            return res.send({status:false, msg:"Profile picture required!", requiredField:"image"})
        }
    } catch (error) {
        console.log(error);
        if(error instanceof PrismaClientKnownRequestError){
            if (error.code === "P2002"){
                return res.send({status:false, msg:"Profile already exists for user. Try updating profile instead."})
            }
        }
    }
}
export const updateProfile = async(req, res)=>{
    try {
        const {firstName, lastName, userId} = req.body;
        if(req?.currUserId !== parseInt(userId)){
            return res.send({status:false, msg:"Unauthorized. Cannot change other users's profile."})
        }
        let profilePicture = "uploads/images/profilePictures/"+userId+"."+req.file.originalname.split('.').pop();
        renameSync(req.file.path, profilePicture);
        const userProfile = await prisma.profile.update({
            where:{
                userId:parseInt(userId)
            },
            data:{
                firstName,
                lastName,
                profilePicture,
            }
        });
        return res.send({status:true, msg:"Profile Updated!", profile:userProfile})
    } catch (error) {
        console.log(error);
        
        if(error instanceof PrismaClientKnownRequestError){
            if (error.code === "P2025"){
                return res.send({status:false, msg:"Invalid User ID. User does not exist for this user Id"})
            }
        }
    }
}
export const viewUserProfile = async (req, res)=>{
    try {
        const {userId} = req.query;
        const userProfile = await prisma.profile.findUnique({
            where:{
                userId:parseInt(userId)
            }
        });
        return res.send({status:true, profile:userProfile})

    } catch (error) {
        console.log(error);
        if(error instanceof PrismaClientKnownRequestError){
            if (error.code === "P2025"){
                return res.send({status:false, msg:"Invalid User ID. User does not exist for this user Id"})
            }
        }
    }
}
export const viewUser = async(req, res)=>{
    try {
        const {userId} = req.query;
        const user  = await prisma.user.findUnique({
            where:{
                id:parseInt(userId)
            },
            include:{
                posts:true,
                profile:true
            }
        });
        delete user.hash;
        return res.send({status:true, user})
    } catch (error) {
        console.log(error);
        if(error instanceof PrismaClientKnownRequestError){
            if (error.code === "P2025"){
                return res.send({status:false, msg:"Invalid User ID. User does not exist for this user Id"})
            }
        }
    }
}
export const followUnfollowUsers = async (req, res)=>{
    try {
        // followerId -> 
        const {userId, to} = req.query;
        const users = await prisma.user.findMany({
            where:{
                id: {in : [parseInt(to), parseInt(userId)]}
            }
        });
        let me, other;
        let followed;

        if(users.length<2){
            return res.send("Invalid User ids")
        }
        if(parseInt(userId) < parseInt(to)){
            me = users[0];
            other = users[1]
        }else{
            me = users[1];
            other = users[0]
        }
        if(me.following.includes(parseInt(to))){
            // Unfollow Logic
            let i = me.following.indexOf(to);
            me.following.splice(i, 1);

            let j = other.followers.indexOf(userId);
            other.followers.splice(j, 1);
            followed=false;
        }else{
            // follow logic
            me.following.push(parseInt(to));
            other.followers.push(parseInt(userId));
            followed=true;
        }
        const updatedUser = await prisma.user.update({
            where:{
                id:parseInt(userId)
            },
            data:{
                email:undefined,
                hash:undefined,
                followers:me.followers,
                following:me.following
            }
        });
        const updateOtherUser = await prisma.user.update({
            where:{
                id:parseInt(to)
            },
            data:{
                email:undefined,
                hash:undefined,
                followers:other.followers,
                following:other.following
            }
        })
        return res.send({status:true, msg:followed ? `Followed user ${to}` : `Unfollowed user ${to}`, updatedUser});
    } catch (error) {
        console.log(error);
    }
}

