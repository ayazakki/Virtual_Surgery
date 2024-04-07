const express=require('express');
const router= express.Router();
const{addPatient}=require("../controllers/patientController");
//const validateObjectId=require("../middlewares/validateObjectId");
const{verifytoken}=require("../middlewares/verifyToken")



//http methods 

router.route( '/' )
    .post(verifytoken,addPatient);
   






module.exports=router;