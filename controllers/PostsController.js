import { PrismaClient } from "@prisma/client"
import {renameSync, unlinkSync} from 'fs'
const prisma = new PrismaClient();

const postCache = new Map()

export const createPost = async(req, res)=>{
    try {
        let {isImage} = req.body;
        let {userId} = req.query;

        //The data variable to be uploded to databas
        let postData;
        let postname;
        isImage = Boolean(parseInt(isImage))

        //Check for image data to upload.
        if(isImage){
            if(!postCache.has(userId)){
                postCache.set(userId, 1);
            }else{
                let c = postCache.get(userId);
                postCache.set(userId, c+1);
            }
            postname = req.currUserUname+"_"+postCache.get(userId);

            //Change the filepath to our desired path.
            postData = `uploads/images/posts/`+postname+"."+req.file.originalname.split('.').pop();
            renameSync(req.file.path, postData);
        }else{
            postData = req.body.data;
        }
        const post = await prisma.post.create({
            data:{
                data:postData,
                isImage,
                userId:parseInt(userId)
            }
        });
        return res.send({status:true, post:post})
    } catch (error) {
        console.log(error);
    }
}
export const updatePost = async(req, res)=>{
    try {
        let {isImage, data} = req.body;
        let {postId} = req.query
        isImage = Boolean(parseInt(isImage))

        //Check for old post if it's an image and retreive it's path
        let post = await prisma.post.findUnique({
            where:{
                id:parseInt(postId)
            }
        });
        //Delete the image
        if(post.isImage){
            unlinkSync(post.data)
        }
        if(isImage){
            let postData = post.data;
            renameSync(req.file.path, postData);
            return res.send({status:true, post:post})
        }else{
            let newPost = await prisma.post.update({
                where:{
                    id:parseInt(postId)
                },
                data:{
                    data:data,
                    isImage
                }
            });
            return res.send({status:true,post:newPost});
        }
    } catch (error) {
        console.log(error);
    }
}
export const deletePost = async(req, res)=>{
    try {
        const {postId} = req.query;
        const post = await prisma.post.delete({
            where:{
                id:parseInt(postId)
            }
        });
        if(post.isImage){
            unlinkSync(post.data);
        }
        return res.send({status:true, msg:"Post Deleted", post})
    } catch (error) {
        console.log(error);
    }
}
export const getAllPosts = async(req, res)=>{
    try {
        const {userId} = req.query
        const posts = await prisma.post.findMany({
            where:{
                userId:parseInt(userId)
            },
            include:{
                comments:true
            }
        });
        return res.send({status:true, posts:posts})
    } catch (error) {
        console.log(error);
    }
}
export const getPost = async(req, res)=>{
    try {
        const {postId} = req.query
        const post = await prisma.post.findMany({
            where:{
                id:parseInt(postId)
            },
            include:{
                comments:true
            }
        });
        return res.send({status:true, post:post})
    } catch (error) {
        console.log(error);
    }
}
export const likeUnlikePost = async(req, res)=>{
    try {
        let liked;
        let likeCount;
        let {postId, userId} = req.query;
        postId = parseInt(postId);
        userId = parseInt(userId)
        const post = await prisma.post.findUnique({
            where:{
                id:postId
            }
        });
        if(post.likes.includes(userId)){
            let i = post.likes.indexOf(userId);
            if(i>-1){
                post.likes.splice(i,1);
            }
            liked=false
        }else{
            post.likes.push(userId);
            liked=true;
        }
        likeCount = post.likes.length
        delete post.id;
        const newPost = await prisma.post.update({
            where:{
                id:postId
            },
            data:{
                ...post
            }
        })
        newPost.likeCount = likeCount;
        return res.send({status:true, msg: liked ? "Post Liked" : "Post Unliked",post:newPost})
    } catch (error) {
        console.log(error);
    }

}
export const commentOnPost = async(req, res)=>{
    try {
        const {postId, userId} = req.query;
        const {comment} = req.body;
        const data = await prisma.comment.create({
            data:{
                userId:parseInt(userId),
                comment,
                postId:parseInt(postId)
            }
        });
        return res.send({status:true, comment:data, msg:"Commented on post."})
    } catch (error) {
        console.log(error);
    }
}
export const deleteComment = async (req, res)=>{
    try {
        const {commentId} = req.query;
        await prisma.comment.delete({
            where:{
                id:parseInt(commentId)
            }
        })
        return res.send({status:true, msg:"Comment deleted!"})
    } catch (error) {
        console.log(error);
    }
}

