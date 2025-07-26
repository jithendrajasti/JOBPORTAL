const mongoose=require('mongoose');
require('dotenv').config();
//function to connect to mongodb database

const connectDb=async()=>{
    mongoose.connection.on('connected',()=>{
        console.log("DataBase connected");
    });
    await mongoose.connect(`${process.env.MONGODB_URL}/job-portal`,{
        serverSelectionTimeoutMS: 30000,
        connectTimeoutMS:30000,
        socketTimeoutMS:30000
    });
}

module.exports=connectDb;
