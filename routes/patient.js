const express=require('express');
const router= express.Router();
const{addPatient,getPatients}=require("../controllers/patientController");
//const validateObjectId=require("../middlewares/validateObjectId");
const{verifyToken}=require("../middlewares/verifyToken");



//http methods 
router.route( '/' )
      .get(verifyToken,getPatients)
      .post(verifyToken,addPatient);

   






module.exports=router;