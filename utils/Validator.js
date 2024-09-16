import { body, query,check} from "express-validator";


const isImage = function(value, filename){
    console.log(value);
    
    var extension = (path.extname(filename)).toLowerCase();
    switch (extension) {
        case '.jpg':
            return '.jpg';
        case '.jpeg':
            return '.jpeg';
        case  '.png':
            return '.png';
        default:
            return false;
    }
}

// For Auth controllers
export const userAuthValidateSchemaChain = [
    body("email").exists({checkFalsy:true}).withMessage("Field 'email' is required").isEmail().withMessage("Email must be a valid email adress."),
    body("password").exists({checkFalsy:true}).withMessage("password is required!").isString().withMessage("Password must be string")
]


// For App Controllers
export const profileValidateSchemaChain = [
    body("firstName").exists({checkFalsy:true}).withMessage("firstName is a required feild").not().isEmpty().isString().withMessage("first name must be a string"),
    body("lastName").exists({checkFalsy:true}).withMessage("lastName is a required field").isString().withMessage("last name must be a string"),
    body("userId").exists({checkFalsy:true}).withMessage("User Id is required").isInt().withMessage("User Id must be Valid integer Id"),
]
export const followServiceValidateSchemaChain = [
    query("userId").exists({checkFalsy:true}).withMessage("userId is required"),
    query("to").exists({checkFalsy:true}).withMessage("Connection user's id required (field:'to')")
]
export const viewProfileOrUserValidate = [
    query("userId").exists({checkFalsy:true}).withMessage("userId is required"),
]

// For Posts controllers
export const postValidateSchemaChain = [
    query("userId").exists({checkFalsy:true}).withMessage("userId is required"),
    body("isImage").exists({checkFalsy:true}).withMessage("isImage is a required field").isBoolean().withMessage("isImage must be a boolean (1/0/true/false). | True if sending an image, false otherwise |"),
]

export const getDeletePostValidateSchema = [
    query("postId").exists({checkFalsy:true}).withMessage("postId is required"),
]
export const getAllPostsValidateSchema = [
    query("userId").exists({checkFalsy:true}).withMessage("userId is required"),
]
export const likeUnlikePostValidateSchema = [
    query("userId").exists({checkFalsy:true}).withMessage("userId is required"),
    query("postId").exists({checkFalsy:true}).withMessage("postId is required"),
]
export const commentValidateSchemaChain = [
    query("userId").exists({checkFalsy:true}).withMessage("userId is required"),
    query("postId").exists({checkFalsy:true}).withMessage("postId is required"),
    body("comment").exists().withMessage("comment is a required field").isString("comment must be a string")
]