const express=require('express');
const router= express.Router();
const {Photoupload} = require("../middlewares/photoUpload");
const{ verifyToken }=require("../middlewares/verifyToken");
const validateObjectId=require("../middlewares/validateObjectId")
const{getAllMRI,getMRIById,createNewMRI,updateMRI,deleteMRI,updateMRIImage}=require("../controllers/mriController");
//http methods 

//api/
router.route('/').post(verifyToken,Photoupload.single( 'image' ), createNewMRI)
                .get(getAllMRI);

    //api/mriscan/:id
router.route("/:id")
    .get(validateObjectId,verifyToken,getMRIById)
    .put(validateObjectId,verifyToken,updateMRI)
    .delete(validateObjectId,verifyToken,deleteMRI);
    //api/mriscan/update-image/:id
    router.route("/update-image/:id").
    put(validateObjectId,verifyToken, Photoupload.single('newimage'), updateMRIImage);




module.exports=router;