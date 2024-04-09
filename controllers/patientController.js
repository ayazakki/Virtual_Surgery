const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const { Patient ,validateCreatePatient,validateUpdatePatient} = require("../models/Patient");
const {User}=require("../models/usermodel");
const  {verifyToken,verifyTokenAndAuthorization} = require("../middlewares/verifyToken");

/**
@desc add  patients
@route /api/patients
@method post
@access private (only logged in user)

*/
module.exports.addPatient = asyncHandler(async (req, res) => {
    
    const { error } = validateCreatePatient(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    
    // Access surgeon's ID from req.user
    const surgeonId = req.user.id;

    try {
        const patient = await Patient.create({
            Surgeon: surgeonId, // Use surgeon's ID obtained from the token
            First_Name: req.body.First_Name,
            Last_Name: req.body.Last_Name,
            Gender: req.body.Gender,
            Age: req.body.Age,
            Risk_Factors_And_Life_Style: req.body.Risk_Factors_And_Life_Style,
            Family_History: req.body.Family_History,
            Neurological_Examination: req.body.Neurological_Examination,
            Symptoms: req.body.Symptoms,
            Treatment_History: req.body.Treatment_History,
            Allergies: req.body.Allergies,
            Duration_And_Progression_Of_Symptoms: req.body.Duration_And_Progression_Of_Symptoms,
            Diagnosis: req.body.Diagnosis,
            Medical_History: req.body.Medical_History,
            Notes: req.body.Notes,
            Biopsy_Or_Pathology_Results: req.body.Biopsy_Or_Pathology_Results,
            Lab_Test_Result: req.body.Lab_Test_Result,
            Current_Medications: req.body.Current_Medications,
        });

        res.status(201).json(patient);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

/**
@desc Get  all patient 
@route /api/patients
@method GET
@access private (only logged in user)

*/ 
module.exports.getAllPatients = asyncHandler(async (req, res) => {
    try {
        // Extract user information from the request object
        const user = req.user;
    
        // Retrieve patients related to the user (assuming the user has a field like surgeonId)
        const patientList = await Patient.find({ Surgeon: user.id });
        res.status(200).json(patientList);
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong!" });
      }
});

/** 
@desc delete patients
@route /api/patients/:id
@method delete
@access private (only logged in user and admin)

*/

module.exports.deletePatient  =asyncHandler(async (req,res)=> {

    const patient = await Patient.findById(req.params.id);

        if(!patient){
        
            res.status(404).json({message:'The patient with the given ID was not found.'})
        }
        if(req.user.IsAdmin || req.user.id === patient.Surgeon.toString())
        {
            await Patient.findByIdAndDelete(req.params.id);
            //await MRIScan.deleteMany({ patientId:patient._id});
            res.status(200).json({message : 'Deleted Successfully',
            patientId: patient._id});
        }
        else{
            res.status(403).json({message:"access denied,forbidden"});
        }
    }
);

/**
@desc Get patients by id
@route /api/patients/:id
@method GET
@access private (only logged in user)

*/

module.exports.getPatientByID=asyncHandler(async(req,res)=>{
    
    const patient= await Patient.findById(req.params.id).
    populate("Surgeon",["-Password"]);
    if(patient){
        res.status(200).json(patient);
    }
    else{
        res.status(404).json({message:'The patient with the given ID was not found.'})
    }

}
);

   /**
@desc update patient
@route /api/patients/:id
@method put
@access private ()

*/
module.exports.updatePatient=asyncHandler(async(req,res)=> {
    const {error}= validateUpdatePatient(req.body);
    if (error) {
        res.status(400).json({message:error.details[0].message});
    }
    const patient=await Patient.findById(req.params.id)  ;
    if(!patient){
        res.status(404).json({message:"patient not found"})
    }
    if(req.user.id!== patient.user.toString()){
        return res.status(403).json({message:"access denied,forddien"});
    }

    const updatepatient =  await Patient.findByIdAndUpdate(
        req.params.id,
        {
            $set: {
                FristName:req.body.FirstName,
                LastName:req.body.LastName,
                Age: req.body.Age ,
                Gender: req.body.Gender ,
                RiskFactorsAndLifeStyle:req.body.RiskFactorsAndLifeStyle,
                FamilyHistory:req.body.FamilyHistory,
                NeurologicalExam:req.body.NeurologicalExam,
                Symptoms:req.body.Symptoms,
                TreatmentHistory:req.body.TreatmentHistory,
                Allergies:req.body.Allergies,
                DurationAndProgressionOfSymptoms:req.body.DurationAndProgressionOfSymptoms,
                Diagnosis:req.body.Diagnosis,
                MedicalHistory:req.body.MedicalHistory,
                Notes:req.body.Notes,
                BiopsyOrPathologyResults:req.body.BiopsyOrPathologyResults,
                LabTestResult:req.body.LabTestResult,
                CurrentMedications:req.body.CurrentMedications,
        
            
    
            }
        },{new:true}).populate("Surgeon",["-Passward"]);
        res.status(200).json(updatepatient);
        
        
    
        
});
