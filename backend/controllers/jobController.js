const Job = require("../models/job");


//get all jobs
const getJobs=async(req,res)=>{
      try {
        const jobs=await Job.find({visible:true}).populate({path:'companyId',select:'-password'});
        res.json({success:true,jobs});
      } catch (error) {
        res.json({success:false,message:error.message});
      }
}

//get single job by Id

const getSingleJob=async(req,res)=>{
       try {
         const {id}=req.params

         const job=await Job.findById(id).populate({path:'companyId',select:"-password"});

         if(!job){
            return res.json({success:false,message:"job not found"});
         }

         res.json({success:true,job});


       } catch (error) {
          res.json({success:false,message:error.message});
       }
}

module.exports={getJobs,getSingleJob};