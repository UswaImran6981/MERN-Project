const express = require("express")
const collection = require("./mongo")
const cors = require("cors")
const app = express()
var nodemailer = require('nodemailer');
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.post("/",async(req,res)=>{
    const{email,password}=req.body

    try{
        const check=await collection.findOne({email:email})

        if(check){
            if (password === check.password){
                res.json("exist")
            }
            else{
                res.json("incorrect-password")
            }
            
        }
        else{
            res.json("notexist")
        }

    }
    catch(e){
        res.json("fail")
    }

})



app.post("/signup",async(req,res)=>{
    const{name, email,password}=req.body

    const data={
        name:name,
        email:email,
        password:password
    }
    

    try{
        const check=await collection.findOne({email:email})

        if(check){
            res.json("exist")
        }
        else{
            res.json("notexist")
            await collection.insertMany([data])
        }

    }
    catch(e){
        res.json("fail")
    }

})

app.post('/gen-otp', async (req, res) => {
    const {name, email, otp} = req.body;

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'atifmughal62843@gmail.com',
          pass: 'bhocyqqlvteksokx'
        }
      });
      
      var mailOptions = {
        from: 'atifmughal62843@gmail.com',
        to: email,
        subject: 'OTP Verification',
        html: '<div style="font-family: Arial, sans-serif; background-color: #f2f2f2; padding: 20px;"><h1 style="color: #007bff; text-align: center;">Dear '+name+',</h1><p style="font-size: 16px; line-height: 1.5; color: #333;">Thank you for choosing CodingMania! Your security is our priority, and we are excited to have you as part of our community. To ensure the safety of your account, we are sending you a one-time password (OTP) to complete your registration or login process.</p><p style="font-size: 16px; line-height: 1.5; color: #333;">Please find your OTP below.</p><p style="font-size: 24px; font-weight: bold; color: #007bff; text-align: center;">Your OTP is: '+otp+'</p><p style="font-size: 16px; line-height: 1.5; color: #333;">We are thrilled to have you on board, and we look forward to providing you with an exceptional coding experience at CodingMania.</p><p style="font-size: 16px; line-height: 1.5; color: #333; text-align: center;">Happy coding!</p><p style="font-size: 16px; line-height: 1.5; color: #333; text-align: center;">Sincerely,</p><p style="font-size: 16px; line-height: 1.5; color: #333; text-align: center;">The CodingMania Team</p></div>'
      
    };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
})

app.post("/forgot-password",async(req,res)=>{
    const{email,password}=req.body
    

    try{
        const check=await collection.findOne({email:email})

        if(check){
            res.json("success")
            check.password = password
        }
        else{
            res.json("not-sucess")
        }

    }
    catch(e){
        res.json("fail")
    }

})

app.listen(8000,()=>{
    console.log("port connected");
})





