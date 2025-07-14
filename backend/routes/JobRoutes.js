const express=require('express');
const { getJobs, getSingleJob } = require('../controllers/jobController');

const jobRouter=express.Router();

//Route to get all jobs data

jobRouter.get('/',getJobs);


//Route to get single job by Id

jobRouter.get('/:id',getSingleJob);

module.exports=jobRouter;