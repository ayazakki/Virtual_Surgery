const mongoose =require('mongoose');
const joi=require('joi');
const jwt = require("jsonwebtoken");
const passwordComplexity=require("joi-password-complexity");

//user Schema 

const UserSchema = new mongoose.Schema(
 {
  FirstName: {
   type: String,
   required: true,
   minlength: 3,
   maxlength: 200,
  },
  LastName: {
   type: String,
   required: true,
   minlength: 3,
   maxlength: 200,
  },
  UserName: {
   type: String,
   required: true,
   minlength: 3,
   maxlength: 200,
  },
  Email: {
   type: String,
   required: true,
   minlength: 5,
   maxlength: 100,
   unique: true,
   trim: true,
  },
  Age: {
   type: Number,
   required: true,
   minlength: 0,
  },
  Gender: {
   type: String,
   required: true,
   minlength: 4,
   maxlength: 6,
  },
  Title: {
   type: String,
   required: true,
   minlength: 3,
   maxlength: 200,
  },
  Specialist: {
   type: String,
   required: true,
   minlength: 3,
   maxlength: 200,
  },
  IsAdmin: {
   type: Boolean,
   default: false,
  },
  isAccountVerified:{
    type:Boolean,
    default:false, 
  },
  Password: {
   type: String,
   required: true,
   minlength: 8,
   maxlength: 100,
  },
 },
 { timestamps: true }
);

//Generate Token
UserSchema.methods.generateToken = function(){
    return jwt.sign({id:this._id,IsAdmin:this.IsAdmin},process.env.JWT_SECRET_KEY);

};


//validate Register
function validateRegister(obj) {
    const schema = joi.object({
     FirstName: joi.string().min(3).max(200).required(),
     LastName: joi.string().min(3).max(200).required(),
     UserName: joi.string().min(3).max(200).required(),
     Email: joi.string().trim().min(5).max(100).required().email(),
     Age: joi.number().required().min(0),
     Gender: joi.string().min(4).max(6).required(),
     Title: joi.string().min(3).max(200).required(),
     Specialist: joi.string().min(3).max(200).required(),
     Password: passwordComplexity().required(),
    });
    return schema.validate(obj);
};
//validate Login user
function validateLogin(obj){
    const schema = joi.object({
        Email : joi.string().trim().min(5).max(100).required().email(),
        Password:passwordComplexity().required(),
    });
    return schema.validate(obj);
}

//validate Update user
function validateUpdate(obj) {
    const schema = joi.object({
     FirstName: joi.string().min(3).max(200),
     LastName: joi.string().min(3).max(200),
     UserName: joi.string().min(3).max(200),
     Email: joi.string().trim().min(5).max(100).email(),
     Age: joi.number().min(0),
     Gender: joi.string().min(3).max(5),
     Title: joi.string().min(3).max(200),
     Specialist: joi.string().min(3).max(200),
     Password: passwordComplexity(),
    });
    return schema.validate(obj);
};
//validate model
const User = mongoose.model("User", UserSchema);

//validate Email
function validateEmail(obj) {
    const schema=joi.object({
        Email: joi.string().trim().min(5).max(100).email().required(),
    });
    return schema.validate(obj);
}

//validate new password
function validateNewPassword(obj){
    const schema = joi.object({
        Password:passwordComplexity().required(),
    });
    return schema.validate(obj);
}

module.exports={
    User,
    validateRegister,
    validateLogin,
    validateUpdate,
    validateEmail,
    validateNewPassword,
};
