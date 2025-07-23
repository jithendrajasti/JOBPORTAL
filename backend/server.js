const express=require('express');
const cors=require('cors');
const connectDb = require('./config/database');
require('dotenv').config();
require('./config/instrument.js');
const {clerkMiddleware}=require('@clerk/express');
//Initialize express
const sentry=require('@sentry/node');
const clerkWebhooks = require('./controllers/webhooks.js');
const router = require('./routes/CompanyRoutes.js');
const connectCloudinary = require('./config/cloudinary.js');
const jobRouter = require('./routes/JobRoutes.js');
const userRoute = require('./routes/userRoutes.js');
const app=express();

//connect to database

(async()=>{
    try {
        await connectDb();
        await connectCloudinary();
    } catch (error) {
        console.log(error.message);
    }
})();
 
//Middleware

app.use(cors({
  origin: ['https://jobportal-frontend-sigma.vercel.app','http://localhost:5173'],
  credentials: true,
}));

app.use(express.json());

app.use(clerkMiddleware());
//Routes
app.get('/',(req,res)=>{
    res.send("API WORKING !");
})
app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});
app.post('/webhooks', clerkWebhooks);
app.use('/api/company',router);
app.use('/api/jobs',jobRouter);
app.use('/api/user',userRoute);
sentry.setupExpressErrorHandler(app);
//port

const port=process.env.PORT || 5000;

app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
});