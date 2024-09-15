import { Router } from "express";
import { userCheck, verifyToken } from "../utils/HelperFuncs.js";
import {
  createProfile,
  followUnfollowUsers,
  updateProfile,
  viewUser,
  viewUserProfile,
} from "../controllers/AppControllers.js";
import multer from "multer";
import { profileValidateSchemaChain } from "../utils/Validator.js";
import { validationResult } from "express-validator";

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
  createProfile
);
router.put(
  "/api/v1/app/updateUserProfile",
  verifyToken,
  uploadImage.single("image"),
  profileValidateSchemaChain,
  async (req, res, next) => {
    const results = validationResult(req);
    console.log(results);

    if (!results.isEmpty()) {
      return res.send({ errors: results.array() });
    }
    next();
  },
  updateProfile
);
router.put("/api/v1/app/followUnfollow", verifyToken, userCheck, followUnfollowUsers)

export default router;
