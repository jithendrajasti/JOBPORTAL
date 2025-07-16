const express=require('express');
const { registerCompany, loginCompany, getCompanyData, postJob, getCompanyJobApplicants, getCompanyPostedJobs, changeJobApplicationStatus, changeJobVisibility, resetPassword, verifyPassword } = require('../controllers/companyController');
const upload = require('../config/multer');
const protectCompany = require('../middlewares/companyMiddleware');

const router=express.Router();

//register comapany

router.post('/register',upload.single('image'),registerCompany);

//company login

router.post('/login',loginCompany);

//get company data for jobcard

router.get('/company-data',protectCompany,getCompanyData);

//post a new job

router.post('/post-job',protectCompany,postJob);

//Get Applicants Data of company

router.get('/applicants',protectCompany,getCompanyJobApplicants);

//Get company job list

router.get('/list-jobs',protectCompany,getCompanyPostedJobs);

//Change application status-view application page

router.post('/change-status',protectCompany,changeJobApplicationStatus);

//change application visibility

router.post('/change-visibility',protectCompany,changeJobVisibility);

router.post('/reset-pass',resetPassword);
router.post('/verify-otp',verifyPassword);

module.exports=router;

