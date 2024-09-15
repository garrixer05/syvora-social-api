import { Router } from "express";
import { userCheck, verifyToken } from "../utils/HelperFuncs.js";
import {
  commentOnPost,
  createPost,
  deleteComment,
  deletePost,
  getAllPosts,
  getPost,
  likeUnlikePost,
  updatePost,
} from "../controllers/PostsController.js";
import multer from "multer";

const router = Router();
const uploadImage = multer({
  dest: "uploads/images/posts",
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png ,jpg and jpeg format are allowed!"));
    }
  },
});

router.get("/api/v1/posts/getAllPosts", verifyToken, getAllPosts);
router.get("/api/v1/posts/getPost", verifyToken, getPost);

router.put("/api/v1/posts/likeUnlikePost", verifyToken, likeUnlikePost);
router.post("/api/v1/posts/comment", verifyToken, commentOnPost);
router.delete(
  "/api/v1/posts/deleteComment",
  verifyToken,
  userCheck,
  deleteComment
);

router.post(
  "/api/v1/posts/createPost",
  verifyToken,
  uploadImage.single("data"),
  userCheck,
  createPost
);
router.put(
  "/api/v1/posts/updatePost",
  verifyToken,
  uploadImage.single("data"),
  userCheck,
  updatePost
);
router.delete("/api/v1/posts/deletePost", verifyToken, userCheck, deletePost);

export default router;
