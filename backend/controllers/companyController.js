const Company = require('../models/Company.js');
const bcrypt = require('bcrypt');
const { v2: cloudinary } = require('cloudinary');
const generateToken = require('../utils/generateToken.js');
require('dotenv').config();
const Job=require('../models/job.js');
const JobApplication=require('../models/JobApplication.js');
const {PASSWORD_RESET_TEMPLATE}=require('../config/emailTemplate.js');
const transporter=require('../config/nodeMailer.js');
//Register a new company

const registerCompany = async (req, res) => {
    const { name, email, password } = req.body;
    const imageFile = req.file;
    if (!name || !email || !password || !imageFile)
        return res.json({ success: false, message: "Missing Details" });

    try {
        const isCompanyExists = await Company.findOne({ email });
        if (isCompanyExists) {
            return res.json({ success: false, message: "Company already registered" });
        }

        //encrypting password

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        //uploading image to cloudinary

        const imageUpload = await cloudinary.uploader.upload(imageFile.path);

        const company = await Company.create({
            name, email, password: hashPassword, image: imageUpload.secure_url
        })

        res.json({
            success: true, company: {
                _id: company._id,
                name: company.name,
                email: company.email,
                image: company.image
            },
            token: generateToken(company._id)
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }

}

//company login
const loginCompany = async (req, res) => {
    const { email, password } = req.body;

    try {
        const company = await Company.findOne({ email });
        if (company) {
            if (await bcrypt.compare(password, company.password)) {
                res.json({
                    success: true,
                    company: {
                        id: company._id,
                        name: company.name,
                        email: company.email,
                        image: company.image
                    },
                    token:generateToken(company._id)
                });
            }
            else{
                res.json({
                    success:false,
                    message:'Invalid password'
                });
            }
        }
        else{
            res.json({success:false,message:'Invalid email'});
        }
    } catch (error) {
         res.json({success:false,message:error.message});
    }
}

//Get comapny data

const getCompanyData = async (req, res) => {

    
    try {

      const companyId=req.company;
      res.json({success:true,companyId})

    } catch (error) {
        res.json({success:false,message:error.message})
    }

}

//post new job

const postJob = async (req, res) => {
      const {title,description,location,level,category,salary}=req.body;
      const date=Date.now();
      const companyId=req.company._id;
    
      try {
        const newJob=await Job.create({
            title,description,location,category,level,salary,date,companyId
        });
        res.json({success:true,message:"Job added "});
      } catch (error) {
        res.json({success:false,message:error.message});
      }
}

//get company job applicants

const getCompanyJobApplicants = async (req, res) => {
       try {
        
        const companyId=req.company._id;

        //find job applications for the user and populate related data

        const applications=await JobApplication.find({companyId}).populate('userId','name image resume').populate('jobId','title location category level salary').exec();

        res.json({success:true,applications});

       } catch (error) {
        res.json({success:false,message:error.message});
       }
}

//get company posted jobs

const getCompanyPostedJobs = async (req, res) => {

    try {
        
        const companyId=req.company._id;
        const jobs=await Job.find({companyId});
        //no.of applicants
        const jobsData=await Promise.all(jobs.map(async(job)=>{
                const applicants=await JobApplication.find({jobId:job._id});

                return {...job.toObject(),applicants:applicants.length};
        }))
        res.json({success:true,jobsData});

    } catch (error) {
        res.json({success:false,message:error.message});
    }

}

//change job applications status

const changeJobApplicationStatus = async (req, res) => {
   
       try {
         const {id,status}=req.body;
        await JobApplication.findOneAndUpdate({_id:id},{status});
        res.json({success:true,message:'status updated'});
       } catch (error) {
        res.json({success:false,message:error.message});
       }
}

//change job visibility

const changeJobVisibility = async (req, res) => {

    try {
        
        const {id}=req.body;

        const companyId=req.company._id;

        const job=await Job.findById(id);

        if(companyId.toString() === job.companyId.toString()){
            job.visible=!job.visible;
        }
        
        await job.save();

        res.json({success:true,message:"changed visibility"});
    } catch (error) {
        res.json({success:false,message:error.message});
    }

}
//to reset password

const resetPassword=async(req,res)=>{
    const {email}=req.body;
    if(!email){
        return res.json({success:false,message:"Email is required"});
    }
    try {
        const user=await Company.findOne({email});
         if(!user){
        return  res.json({success:false,message:"user not found"});
      }
      const otp=Math.floor(100000+Math.random() * 900000).toString();
        user.resetOtp=otp;
        user.resetOtpExpireAt=Date.now()+5*60*1000;
        await user.save();

        const mailOptions={
          from:process.env.SENDER_EMAIL,
          to:user.email,
          subject:"password reset OTP",
          html:PASSWORD_RESET_TEMPLATE.replace("{{email}}",email).replace('{{otp}}',otp)
        }
        await transporter.sendMail(mailOptions);
        
        res.json({success:true,message:"OTP sent to your email"});
    } catch (error) {
        res.json({success:false,message:error.message});
    }
}

//const verifyPassword

const verifyPassword=async(req,res)=>{
    const {email,newpassword,otp}=req.body;
    if(!email || !otp || !newpassword){
        return res.json({success:false,message:"all fields are required"});
    }
    try{
         const user=await Company.findOne({email});
         if(!user){
            return res.json({success:false,message:"user not found"});
         }
         if(user.resetOtp==='' || user.resetOtp!==otp){
            return  res.json({success:false,message:"invalid otp"});
         }
         if(user.resetOtpExpireAt < Date.now()){
            return  res.json({success:false,message:"Password Reset OTP is expired"});
         }
         const isOld = await bcrypt.compare(newpassword, user.password);

         if(isOld){
            return  res.json({success:false,message:"password used previously"});
         }
         const salt = await bcrypt.genSalt(10);
        const hashedpassword = await bcrypt.hash(newpassword, salt);
         user.password=hashedpassword;
         user.resetOtp='';
         user.resetOtpExpireAt=0;
         await user.save();

        res.json({success:true,message:"password reset successful"});
    }catch(error){
         res.json({success:false,message:error.message});
    }
}

module.exports = { registerCompany, loginCompany, getCompanyData, postJob, getCompanyJobApplicants, getCompanyPostedJobs, changeJobApplicationStatus, changeJobVisibility,resetPassword,verifyPassword };