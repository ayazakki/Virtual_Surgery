const express = require("express");
const router = express.Router();
const { Patient,validateCreatePatient } = require("../models/Patient");
const {User}=require("../models/usermodel");
const  {verifyToken} = require("../middlewares/verifyToken");

/**
@desc add  patients
@route /api/patients
@method post
@access private in log in

*/
module.exports.addPatient=asyncHandler( async (req,res)=>{
    
    const {error}=validateCreatePatient(req.body);
        if (error) {
        res.status(400).send(error.details[0].message);
        }
        
            const patient= await  Patient.create({
                Surgeon:req.Surgeon.id,
                First_Name:req.body.First_Name,
                Last_Name:req.body.Last_Name,
                Gender:req.body.Gender,
                Age:req.body.Age,
                Risk_Factors_And_Life_Style:req.body.Risk_Factors_And_Life_Style,
                Family_History:req.body.Family_History,
                Neurological_Examination:req.body.Neurological_Examination,
                Symptoms:req.body.Symptoms,
                Treatment_History:req.body.Treatment_History,
                Allergies:req.body.Allergies,
                Duration_And_Progression_Of_Symptoms:req.body.Duration_And_Progression_Of_Symptoms,
                Diagnosis:req.body.Diagnosis,
                Medical_History:req.body.Medical_History,
                Notes:req.body.Notes,
                Biopsy_Or_Pathology_Results:req.body.Biopsy_Or_Pathology_Results,
                Lab_Test_Result:req.body.Lab_Test_Result,
                Current_Medications:req.body.Current_Medications,
                
            });
            
            res.status(201).json(patient);
            
    
        
    });