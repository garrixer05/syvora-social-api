import { Router } from "express";
import {
  userCheck,
  validateResults,
  verifyToken,
} from "../utils/HelperFuncs.js";
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
import {
  commentValidateSchemaChain,
  getAllPostsValidateSchema,
  getDeletePostValidateSchema,
  likeUnlikePostValidateSchema,
  postValidateSchemaChain,
} from "../utils/Validator.js";

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

router.get(
  "/api/v1/posts/getAllPosts",
  verifyToken,
  getAllPostsValidateSchema,
  validateResults,
  getAllPosts
);
router.get(
  "/api/v1/posts/getPost",
  verifyToken,
  getDeletePostValidateSchema,
  validateResults,
  getPost
);

router.put(
  "/api/v1/posts/likeUnlikePost",
  verifyToken,
  likeUnlikePostValidateSchema,
  validateResults,
  likeUnlikePost
);
router.post(
  "/api/v1/posts/comment",
  verifyToken,
  commentValidateSchemaChain,
  validateResults,
  commentOnPost
);
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
  postValidateSchemaChain,
  validateResults,
  createPost
);
router.put(
  "/api/v1/posts/updatePost",
  verifyToken,
  uploadImage.single("data"),
  userCheck,
  postValidateSchemaChain,
  validateResults,
  updatePost
);
router.delete(
  "/api/v1/posts/deletePost",
  verifyToken,
  userCheck,
  getDeletePostValidateSchema,
  validateResults,
  deletePost
);

export default router;
