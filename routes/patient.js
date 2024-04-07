const express=require('express');
const router= express.Router();
const{addPatient,getAllPatients,deletePatient}=require("../controllers/patientController");
const validateObjectId=require("../middlewares/validateObjectId");
const{verifyToken}=require("../middlewares/verifyToken");



//http methods 
router.route( '/' )
      .get(verifyToken,getAllPatients)
      .post(verifyToken,addPatient);

   
router.route( '/:id' )
      .delete(validateObjectId,verifyToken,deletePatient);



module.exports=router;