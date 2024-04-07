const express=require('express');
const router= express.Router();
const{addPatient}=require("../controllers/patientController");
//const validateObjectId=require("../middlewares/validateObjectId");
const{verifyToken}=require("../middlewares/verifyToken");



//http methods 
router.route( '/' )
 .post(verifyToken,addPatient);

   






module.exports=router;