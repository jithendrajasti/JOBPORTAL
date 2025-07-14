const {Webhook}=require('svix');
const User =require('../models/User.js');
require('dotenv').config();
//API controller function to manage Clerk User with DataBase

const clerkWebhooks=async(req,res)=>{
           try {
               //creating svix instance with clerk webhook secret
               const whook=new Webhook(process.env.CLERK_WEBHOOK_SECRET);
               //verifying headers
               await whook.verify(JSON.stringify(req.body),{
                "svix-id":req.headers["svix-id"],
                "svix-timestamp":req.headers["svix-timestamp"],
                "svix-signature":req.headers["svix-signature"]
               })
               //Getting data from request body
               const {data,type}=req.body;
               //switch case for different types
               switch(type){
                case 'user.created':{
                        const userData={
                            _id:data.id,
                            email:data.email_addresses[0].email_address,
                            name:data.first_name+" "+data.last_name,
                            image:data.profile_image_url,
                            resume:''
                        }
                        await User.create(userData);
                        res.json({});
                        break;
                }
                case 'user.updated':{
                     const userData={
                            email:data.email_addresses[0].email_address,
                            name:data.first_name+" "+data.last_name,
                            image:data.profile_image_url
                        }
                        await User.findByIdAndUpdate(data.id,userData);
                        res.json({});
                        break;
                }
                case 'user.deleted':{
                    await User.findByIdAndDelete(data.id);
                    res.json({});
                    break;
                }
                default:{
                    break;
                }
               }
           } catch (error) {
                console.log(error.message);
                res.json({success:false,message:"webhooks error!"});
           }
}

module.exports=clerkWebhooks;