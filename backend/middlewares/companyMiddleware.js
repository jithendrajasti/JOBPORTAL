const jwt=require('jsonwebtoken');
const Company=require('../models/Company.js');
require('dotenv').config();
const protectCompany=async(req,res,next)=>{
    
        const token=req.headers.token;

        if(!token){
            return res.json({success:false,message:"Token not generated,login again"});
        }

        try {
            const decodedToken=jwt.verify(token,process.env.JWT_SECRET);
            req.company=await Company.findById(decodedToken.id).select('-password');
            next();
        } catch (error) {
            res.json({success:false,message:error.message});
        }
}

module.exports=protectCompany;