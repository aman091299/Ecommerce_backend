const User=require('../models/user');
const express=require('express');
const authRouter=express.Router();
const bcrypt=require('bcrypt');

authRouter.post('/signup',async(req,res)=>{
   try{
     
 const {emailId,password,firstName,lastName,role}=req.body;

        if (!emailId) {
     return  res.status(400).json({success: false,message:"Emailid is required"})
    }
    if (!password) {
     return res.status(400).json({success: false,message:"Password is required"});
    }
      if (!firstName) {
     return  res.status(400).json({success: false,message:"firstName is required"})
    }
    if (!lastName) {
     return res.status(400).json({success: false,message:"lastName is required"});
    }
   const userExist=await User.findOne({emailId});
   if(userExist){
    return  res.status(404).json({
         success:false ,
         message:"User Already exist please login"
      })
   }
   const hashPassword=await bcrypt.hash(password,10)
   const user=new User({
         emailId,firstName,password:hashPassword,role,lastName
   })
   //generate token
   const token =await user.generateAuthToken();
   res.cookie('token',token,{
   expires: new Date(Date.now() + 86400000), 
    secure: false,
      sameSite: "lax",
      httpOnly: true, 
   })
      await user.save();
      user.password=undefined;
   res.status(200).json({
      success:true,
       data:user,
      message:'user is successfully register'
   })
   }
   catch(err){
   res.status(500).json({
      success:false,
     
      message:'user registeration fail' + err,
   })
   }
  
   
})

authRouter.post('/login',async(req,res)=>{
  try {
     const {emailId,password}=req.body;
    
        if (!emailId) {
     return  res.status(400).json({success: false,message:"Emailid is required"})
    }
    if (!password) {
     return res.status(400).json({success: false,message:"Password is required"});
    }
    
    const userExist=await User.findOne({emailId});
    if(!userExist){
     return res.status(404).json({
         success:false,
         message:" Please signup "
      })
    }

    const hashPassword=(userExist.password);

    const comparePassword=await bcrypt.compare(password,hashPassword);
    
    if(!comparePassword){
    return  res.status(404).json({
         success:false,
         message:"Invalid credentials"
      })
    }
    const token=await userExist.generateAuthToken();

    res.cookie('token',token,{
        expires: new Date(Date.now() + 86400000), 
    // "path" - The cookie is accessible for APIs under the '/api' route
   //  path: '/api', 
    // "domain" - The cookie belongs to the 'example.com' domain
   //  domain: 'example.com', 
    // "secure" - The cookie will be sent over HTTPS 
//   sameSite: 'lax', // Use 'lax' or 'strict' for local, 'none' only if using HTTPS + cross-origin
    secure: false,
      sameSite: "lax",
      httpOnly: true,     
           
  // "HttpOnly" - The cookie cannot be accessed by client-side scripts
  
    })
    userExist.password=undefined;
    res.status(200).json({
      success:true,
      message:"successfully login",
         data:userExist
    })
  } catch (error) {
      res.status(500).json({
      success:false,
      message:"login fail" +error
    })
  }
   

     
})

authRouter.post('/logout',async(req,res)=>{

   res.clearCookie("token");
   return  res.status(200).json({
  success: true,
    message: "User logout sucessfully",
  });
})

module.exports=authRouter;