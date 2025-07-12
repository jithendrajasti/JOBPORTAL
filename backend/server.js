const express=require('express');
const cors=require('cors');
const connectDb = require('./config/database');
require('dotenv').config();
require('./config/instrument.js');

//Initialize express
const sentry=require('@sentry/node');
const clerkWebhooks = require('./controllers/webhooks.js');
const app=express();

//connect to database

(async()=>{
    try {
        await connectDb();
    } catch (error) {
        console.log(error.message);
    }
})();
 
//Middleware

app.use(cors());

app.use(express.json());

//Routes
app.get('/',(req,res)=>{
    res.send("API WORKING !");
})
app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});
app.post('/webhooks',clerkWebhooks)
sentry.setupExpressErrorHandler(app);
//port

const port=process.env.PORT || 5000;

app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
});