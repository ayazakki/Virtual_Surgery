const express=require('express');
const router= express.Router();
const {Photoupload} = require("../middlewares/photoUpload");
const{ verifyToken }=require("../middlewares/verifyToken");
const validateObjectId=require("../middlewares/validateObjectId")
const { NiiUpload } = require('../utils/niiUpload');
const{getAllMRI,getMRIById,createNewMRI,updateMRI,deleteMRI,updateMRIfile,deleteMultipleMRIScans}=require("../controllers/mriController");
//http methods 

// Define a route for deleting multiple MRIScans
router.route('/delete-multiple')
    .delete(verifyToken, deleteMultipleMRIScans);
    
//api/
/*
router.route('/').post(verifyToken,Photoupload.single( 'image' ), createNewMRI)
                .get(verifyToken,getAllMRI);
*/
router.route('/').post(verifyToken,NiiUpload.single('file'), createNewMRI)

    //api/mriscan/:id
router.route("/:id")
    .get(validateObjectId,verifyToken,getMRIById)
    .put(validateObjectId,verifyToken,updateMRI)
    .delete(validateObjectId,verifyToken,deleteMRI);
    //api/mriscan/update-image/:id
    router.route("/update-file/:id").
    put(validateObjectId,verifyToken, NiiUpload.single('file'), updateMRIfile);




module.exports=router;