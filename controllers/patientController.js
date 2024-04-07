const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const { Patient ,validateCreatePatient} = require("../models/Patient");
const {User}=require("../models/usermodel");
const  {verifyToken} = require("../middlewares/verifyToken");

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
@access private (only logged in user)

*/

module.exports.deletePatient = asyncHandler(async (req, res) => {
    try {
        // Find the patient by ID and populate the Surgeon field
        const patient = await Patient.findById(req.params.id).populate("Surgeon");

        // Check if the patient exists
        if (!patient) {
            return res.status(404).json({ message: 'The patient with the given ID was not found.' });
        }

        // Check if the user is authorized to delete the patient
        if (req.user.IsAdmin || (req.user.id === patient.Surgeon._id.toString())) {
            // Delete the patient record
            await Patient.findByIdAndDelete(req.params.id);

            // Delete associated MRIScan records
            await MRIScan.deleteMany({ patientId: patient._id });

            // Send success response
            return res.status(200).json({
                message: 'Deleted successfully',
                patientId: patient._id
            });
        } else {
            // User is not authorized to delete the patient
            return res.status(403).json({ message: "Access denied, forbidden" });
        }
    } catch (error) {
        // Handle any errors
        console.error("Error in deletePatient:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
