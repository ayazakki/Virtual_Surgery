const mongoose=require("mongoose");
const joi=require('joi');
const { User } = require("../models/usermodel");
const PatientSchema=new mongoose.Schema({
    Surgeon:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User",
    },
    First_Name:{
        type:String,
        required:true,
        trim:true,
        minlength:3,
        maxlength:200,
    },
    Last_Name:{
        type:String,
        required:true,
        trim:true,
        minlength:3,
        maxlength:200,
    },
    Gender:{
        type:String,
        required:true,
        trim:true,
        minlength:4,
        maxlength:6,
    },
    Age:{
        type:String,
        required:true,
        trim:true,
        maxlength:200,
    },
    Risk_Factors_And_Life_Style:{
        type:String,
        trim:true,
        maxlength:1000,
    },
    Family_History:{
        type:String,
        trim:true,
        maxlength:1000,
    },
    Neurological_Examination:{
        type:String,
        trim:true,
        maxlength:1000,
    },
    Symptoms:{
        type:String,
        trim:true,
        maxlength:1000,
    },
    Treatment_History:{
        type:String,
        trim:true,
        maxlength:1000,
    },
    Allergies:{
        type:String,
        trim:true,
        maxlength:1000,
    },
    Duration_And_Progression_Of_Symptoms:{
        type:String,
        trim:true,
        maxlength:1000,
    },
    Diagnosis:{
        type:String,
        trim:true,
        maxlength:1000,
    },
    Medical_History:{
        type:String,
        trim:true,
        maxlength:1000,
    },
    Notes:{
        type:String,
        trim:true,
        maxlength:1000,
    },
    Biopsy_Or_Pathology_Results:{
        type:String,
        trim:true,
        maxlength:1000,
    },
    Lab_Test_Result:{
        type:String,
        trim:true,
        maxlength:1000,
    },
    Current_Medications:{
        type:String,
        trim:true,
        maxlength:1000,
    }
},{
    timestamps:true
});

//new

function validateCreatePatient(obj){
    const schema = joi.object
    ({
        
        First_Name:joi.string().min(3).max(200).required(),
        Last_Name:joi.string().min(3).max(200).required(),
        Gender:joi.string().min(4).max(6).required(),
        Age:joi.number().min(0).integer().required(),
        Risk_Factors_And_Life_Style:joi.string().min(3).max(1000),
        Family_History:joi.string().min(3).max(1000),
        Neurological_Examination:joi.string().min(3).max(1000),
        Symptoms:joi.string().min(3).max(1000),
        Treatment_History:joi.string().min(3).max(1000),
        Allergies:joi.string().min(3).max(1000),
        Duration_And_Progression_Of_Symptoms:joi.string().min(3).max(1000),
        Diagnosis:joi.string().min(3).max(1000),
        Medical_History:joi.string().min(3).max(1000),
        Notes:joi.string().min(3).max(1000),
        Biopsy_Or_Pathology_Results:joi.string().min(3).max(1000),
        Lab_Test_Result:joi.string().min(3).max(1000),
        Current_Medications:joi.string().min(3).max(1000),
        
    });
    return schema.validate(obj);
};

function validateUpdatePatient(obj){
    const schema=joi.object
    ({ 
        FristName:joi.string().min(3).max(200),
        LastName:joi.string().min(3).max(200),
        Age:joi.number().min(0).integer(),
        Gender:joi.string().min(4).max(6),
        RiskFactorsAndLifeStyle:joi.string().min(3).max(1000),
        FamilyHistory:joi.string().min(3).max(1000),
        NeurologicalExam:joi.string().min(3).max(1000),
        Symptoms:joi.string().min(3).max(1000),
        TreatmentHistory:joi.string().min(3).max(1000),
        Allergies:joi.string().min(3).max(1000),
        DurationAndProgressionOfSymptoms:joi.string().min(3).max(1000),
        Diagnosis:joi.string().min(3).max(1000),
        MedicalHistory:joi.string().min(3).max(1000),
        Notes:joi.string().min(3).max(1000),
        BiopsyOrPathologyResults:joi.string().min(3).max(1000),
        LabTestResult:joi.string().min(3).max(1000),
        CurrentMedications:joi.string().min(3).max(1000),
        
        

    });
    return schema.validate(obj);
};


const Patient=mongoose.model("Patient",PatientSchema);

module.exports={
    Patient,
    validateCreatePatient,
    validateUpdatePatient,
}