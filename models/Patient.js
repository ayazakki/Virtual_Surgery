const mongoose=require("mongoose");
const joi=require('joi');
const PatientSchema=new mongoose.Schema({
    Surgeon:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"usermodel"
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
        Risk_Factors_And_Life_Style:joi.string().min(3).max(1000).optional(),
        Family_History:joi.string().min(3).max(1000).optional(),
        Neurological_Examination:joi.string().min(3).max(1000).optional(),
        Symptoms:joi.string().min(3).max(1000).optional(),
        Treatment_History:joi.string().min(3).max(1000).optional(),
        Allergies:joi.string().min(3).max(1000).optional(),
        Duration_And_Progression_Of_Symptoms:joi.string().min(3).max(1000).optional(),
        Diagnosis:joi.string().min(3).max(1000).optional(),
        Medical_History:joi.string().min(3).max(1000).optional(),
        Notes:joi.string().min(3).max(1000).optional(),
        Biopsy_Or_Pathology_Results:joi.string().min(3).max(1000).optional(),
        Lab_Test_Result:joi.string().min(3).max(1000).optional(),
        Current_Medications:joi.string().min(3).max(1000).optional(),
        
    });
    return schema.validate(obj);
};



const Patient=mongoose.model("Patient",PatientSchema);

module.exports={
    Patient,
    validateCreatePatient,
}