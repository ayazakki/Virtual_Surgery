const asyncHandler = require("express-async-handler");
const path =require('path');
const fs=require("fs");
const{cloudinaryUploadImage,cloudinaryRemoveImage}=require("../utils/cloudinary")
const{validateCreateMRIScan,validateUpdateMRIScan,MRIScan} = require("../models/MRimodel");

/** 
@desc Get all MRISCAN
@route /api/mriscan
@method GET
@access (only logged in surgeon)

*/ 

module.exports.getAllMRI = asyncHandler(async (req, res) => {
    const SCAN_PER_PAGE = 3;
    const { pageNumber } = req.query;

    // Assuming the surgeon's ID is stored in req.user.id
    const surgeonId = req.user.id;

    let scans;

    if (pageNumber) {
        scans = await MRIScan.find({ Surgeon: surgeonId }) // Filter scans by surgeon's ID
            .sort()
            .skip((pageNumber - 1) * SCAN_PER_PAGE)
            .limit(SCAN_PER_PAGE)
            .populate("Patient", ["_id", "First_Name", "Last_Name"]);
    } else {
        scans = await MRIScan.find({ Surgeon: surgeonId }) // Filter scans by surgeon's ID
            .sort({ createdAt: -1 })
            .populate("Patient", ["_id", "First_Name", "Last_Name"]);
    }

    res.status(200).json(scans);
});


/** 
@desc Get MRIScan by id
@route /api/mriscan/:id
@method GET

@access (only logged in surgeon)

*/

module.exports. getMRIById =asyncHandler(async(req,res)=>{
    const scans = await MRIScan.findById(req.params.id).populate("Patient");
    if(!scans){
        res.status(404).json({message:'The MRIScan with the given ID was not found.'})
    }
    if(req.user.id !== scans.Surgeon.toString()){
        return res.status(403).json({message:'access denied'});
    }
    res.status(200).json(scans);

});



/** 
@desc add new MriSCAN
@route /api/mriscan
@method post
@access private(only log in user)
*/
module.exports.createNewMRI = async (req, res) => {
    try {
        // 1. Validation for image
        if (!req.file) {
            return res.status(400).send('No image uploaded');
        }

        // 2. Validation for data
        const { error } = validateCreateMRIScan(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }

        // 3. Upload photo to Cloudinary
        const result = await cloudinaryUploadImage(req.file.path);

        // 4. Create new MRISCAN
        const scan = await MRIScan.create({
            Surgeon: req.user.id,
            Patient: req.body.Patient,
            ScanDetalies: req.body.ScanDetalies,
            Image: {
                url: result.secure_url,
                publicId: result.public_id,
            }
        });

        // 5. Send response to the client
        res.status(201).json(scan);

        // 6. Remove image from the server
        fs.unlinkSync(req.file.path);
    } catch (error) {
        console.error('Error creating MRI scan:', error);
        res.status(500).send('Internal server error');
    }
};
/* 
module.exports.createNewMRI = asyncHandler( async (req,res)=>{
    //1.validation for image 
    if(!req.file) {
    return res.status(400).send('No image  uploaded');
    }
    //2.validation for data 
    const {error}=validateCreateMRIScan(req.body);
    if (error) {
    res.status(400).send(error.details[0].message);
    }
    //3.upload photo
    const imagePath=path.join(__dirname,`../images/${req.file.filename}`);
    const result = await cloudinaryUploadImage(imagePath);


    //4.create new MRISCAN
    const scan = await MRIScan.create(
        {   Surgeon:req.user.id,
            Patient:req.body.Patient,
            ScanDetalies:req.body.ScanDetalies,
            Image:{
                url:result.secure_url,
                publicId:result.public_id,
            }
        
        })
    //5.send response to the client 
        res.status(201).json(scan);      
    //6. remove image from the server
        fs.unlinkSync(imagePath);


}
);
*/
/** 
@desc update all MRISCAN
@route /api/mriscan/:id
@method put
@access private only user 
*/
module.exports.updateMRI=asyncHandler(async(req,res)=> {
    //1.validation update
    const {error} = validateUpdateMRIScan(req.body);

    if (error) {
        return res.status(400).json({message: error.details[0].message});
    }
    //2.get  MRI by id from database
    const scan =  await MRIScan.findById(req.params.id);
    if(!scan){
        return res.status(404).json({message:'MRI not found'});
    }
    if(req.user.id !== scan.user.toString()){
        return res.status(403).json({message:'access denied'});}

    const updateMRI=await MRIScan.findByIdAndUpdate(req.params.id,
        {
        $set: {
            ScanDetalies : req.body.ScanDetalies,
        }
    },{ new : true} ).populate('Patient');

    res.status(200).json(updateMRI);
}
);
/** 
@desc update mri image 
@route /api/mriscan/upload-image/:id
@method put
@access private
*/
module.exports.updateMRIImage=asyncHandler(async(req,res)=> {
    //1.validation update

    if (!req.file) {
        return res.status(400).json({message:"no image provided"});
    }
    //2.get  MRI by id from database
    const scan =  await MRIScan.findById(req.params.id);
    if(!scan){
        return res.status(404).json({message:'MRI not found'});
    }
    if(req.user.id !== scan.user.toString()){
        return res.status(403).json({message:'access denied'});
    }

    //4.delete old mri image
    await cloudinaryRemoveImage(scan.Image.publicId);
    //upload new image

    const imagePath=path.join(__dirname,`../images/${req.file.filename}`);
    const result = await cloudinaryUploadImage(imagePath);
    //update image in Db
    const updateMRI=await MRIScan.findByIdAndUpdate(req.params.id,
        {
        $set: {
            Image:{
                url:result.secure_url,
                publicId:result.public_id,
                
            }
        }
    },{ new : true} ).populate('Patient');
    res.status(200).json(updateMRI);
    //remove from server
    fs.unlinkSync(imagePath);

}
);
/** 
@desc delete all mri
@route /api/mriscan/:id
@method delete
@access privat e only user 
*/
module.exports.deleteMRI = asyncHandler(async (req,res)=> {

    const mriscan = await MRIScan.findById(req.params.id);
    
        if(!mriscan){
            
            res.status(404).json({message:'The MRISCAN with the given ID was not found.'})
        }
        if(req.user.id === mriscan.user.toString()){
            await MRIScan.findByIdAndDelete(req.params.id);
            await cloudinaryRemoveImage(mriscan.Image.publicId);
            res.status(200).json({message : 'is delete',
                    mriscanId: mriscan._id});
        }
        else{
            res.status(403).json({message:"access denied "})
        }
    
}
);