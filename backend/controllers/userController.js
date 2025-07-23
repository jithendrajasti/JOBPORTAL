const Job = require("../models/job.js");
const JobApplication = require("../models/JobApplication.js");
const User = require("../models/User.js")
const { v2: cloudinary } = require('cloudinary');

const getUserData = async (req, res) => {
    const userId = req.auth.userId
    try {

        const user = await User.findById(userId);

        if (!user) {
            return res.json({ success: false, message: "user not found" });
        }

        res.json({ success: true, user });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

const applyForJob = async (req, res) => {
    const { jobId } = req.body;

    const userId = req.auth.userId;

    try {

        const isAlreadyApplied = await JobApplication.find({ jobId, userId });

        if (isAlreadyApplied.length > 0) {
            return res.json({ success: false, message: "Already applied" })
        }

        const jobData = await Job.findById(jobId);

        if (!jobData) {
            return res.json({ success: false, message: "Job not found" });
        }

        await JobApplication.create({
            userId, companyId: jobData.companyId, jobId, date: Date.now()
        })

        res.json({ success: true, message: "Applied successfully" });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

const getUserJobApplication = async (req, res) => {
    try {

        const userId = req.auth.userId;

        const applications = await JobApplication.find({ userId }).populate('companyId', 'name email image').populate('jobId', 'title description location category level salary').exec();

        if (!applications) {
            return res.json({ success: false, message: "No job applications found for this user!" });
        }

        res.json({ success: true, applications })

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

const deleteUserApplication = async (req, res) => {
    try {
        const {applicationId} = req.body;
        await JobApplication.findByIdAndDelete(applicationId);
        res.json({ success: true, message: "Job application withdrawl completed" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

const updateUserResume = async (req, res) => {
    try {

        const userId = req.auth.userId;
        const resumeFile = req.file;

        const userData = await User.findById(userId);

        if (resumeFile) {
            const resumeUpload = await cloudinary.uploader.upload(resumeFile.path);
            userData.resume = resumeUpload.secure_url;
        }

        await userData.save();

        res.json({ success: true, message: "Resume Updated" });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

module.exports = { getUserData, applyForJob, getUserJobApplication, updateUserResume,deleteUserApplication };