const mongoose=require('mongoose');

const companySchema=new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    image:{type:String,required:true},
    password:{type:String,required:true},
     resetOtp:{
        type:String,
        default:''
    },
    resetOtpExpireAt:{
        type:Number,
        default:0
    }
})

const Company=mongoose.model('recruiter',companySchema);

module.exports=Company;