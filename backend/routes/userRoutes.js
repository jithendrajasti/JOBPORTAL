const express=require('express');
const upload=require('../config/multer.js');
const { getUserData, applyForJob, getUserJobApplication, updateUserResume, deleteUserApplication } = require('../controllers/userController');

const userRoute=express.Router();

userRoute.get('/user-data',getUserData);
userRoute.post('/apply-job',applyForJob);
userRoute.get('/user-application',getUserJobApplication);
userRoute.post('/delete-application',deleteUserApplication);
userRoute.post('/update-resume',upload.single('resume'),updateUserResume);

module.exports=userRoute;