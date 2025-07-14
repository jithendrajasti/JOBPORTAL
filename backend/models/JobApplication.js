const mongoose=require('mongoose');

const JobApplicationSchema=new mongoose.Schema({
    userId:{
        type:String,ref:'user',required:true
    },
    companyId:{
        type:mongoose.Schema.Types.ObjectId,ref:'recruiter',required:true
    },
    jobId:{
        type:mongoose.Schema.Types.ObjectId,ref:'job',required:true
    },
    status:{
        type:String,default:'Pending'
    },
    date:{type:Number,required:true}
})

const JobApplication=mongoose.model('jobApplication',JobApplicationSchema);

module.exports=JobApplication;