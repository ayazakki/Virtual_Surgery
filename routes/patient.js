const express=require('express');
const router= express.Router();
const{addPatient,getAllPatients}=require("../controllers/patientController");
//const validateObjectId=require("../middlewares/validateObjectId");
const{verifyToken}=require("../middlewares/verifyToken");



//http methods 
router.route( '/' )
      .get(verifyToken,getAllPatients)
      .post(verifyToken,addPatient);

   






module.exports=router;