const express=require('express');
const router= express.Router();
const{addPatient,getAllPatients,deletePatient,getPatientByID}=require("../controllers/patientController");
const validateObjectId=require("../middlewares/validateObjectId");
const{verifyToken}=require("../middlewares/verifyToken");



//http methods 
router.route( '/' )
      .get(verifyToken,getAllPatients)
      .post(verifyToken,addPatient);

   
router.route( '/:id' )
      .get(validateObjectId,verifyToken,getPatientByID)
      .delete(validateObjectId,verifyToken,deletePatient);



module.exports=router;