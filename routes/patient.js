const express=require('express');
const router= express.Router();
const{addPatient}=require("../controller/pateintController");
//const validateObjectId=require("../middlewares/validateObjectId");
const{verifytoken}=require("../middlewares/verifyToken")



//http methods 

router.route( '/' )
    .post(verifytoken,addPatient);
   






module.exports=router;