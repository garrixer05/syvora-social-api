import { Router } from "express";
import { userCheck, validateResults, verifyToken } from "../utils/HelperFuncs.js";
import {
  createProfile,
  followUnfollowUsers,
  updateProfile,
  viewUser,
  viewUserProfile,
} from "../controllers/AppControllers.js";
import multer from "multer";
import { followServiceValidateSchemaChain, profileValidateSchemaChain } from "../utils/Validator.js";

const router = Router();

const uploadImage = multer({
  dest: "uploads/images/profilePictures",
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png .jpg and .jpeg format are allowed!"));
    }
  },
});

router.get("/api/v1/app/viewUser", verifyToken, viewUser);
router.get("/api/v1/app/viewUserProfile", verifyToken, viewUserProfile);
router.post(
  "/api/v1/app/createUserProfile",
  verifyToken,
  uploadImage.single("image"),
  profileValidateSchemaChain,
  validateResults,
  createProfile
);
router.put(
  "/api/v1/app/updateUserProfile",
  verifyToken,
  uploadImage.single("image"),
  profileValidateSchemaChain,
  validateResults,
  updateProfile
);
router.put("/api/v1/app/followUnfollow", verifyToken, userCheck, followServiceValidateSchemaChain, validateResults,followUnfollowUsers)

export default router;
