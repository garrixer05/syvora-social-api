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
export const userAuthValidateSchemaChain = [
    body("email").exists({checkFalsy:true}).withMessage("Field 'email' is required").isEmail().withMessage("Email must be a valid email adress."),
    body("password").exists({checkFalsy:true}).withMessage("password is required!").isString().withMessage("Password must be string")
]

export const profileValidateSchemaChain = [
    body("firstName").exists({checkFalsy:true}).withMessage("firstName is a required feild").not().isEmpty().isString().withMessage("first name must be a string"),
    body("lastName").exists({checkFalsy:true}).withMessage("lastName is a required field").isString().withMessage("last name must be a string"),
    body("userId").exists({checkFalsy:true}).withMessage("User Id is required").isInt().withMessage("User Id must be Valid integer Id"),
]


export const postValidateSchemaChain = [

]

export const commentValidateSchemaChain = [

]