const db = require('../db');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer")

//handling register request
const register = (req,res) => {

    const query = `select * from users where name = ?`
    db.query(query, [req.body.name], (err, result) => {
        if(err){
            return res.status(500).json({message:"database error"})
        }
        if(result.length > 0){
            return res.json(409).json({message:"user already exist"})
        }

          //hashing password
   bcrypt.hash(req.body.password, 10, (err,hashedPassword) => {
    if(err){
        return res.status(500).json({message:"error in hashing password"})
    }

    const insert_query = `insert into users (name, email, password) values (?,?,?)`
    const values = [req.body.name, req.body.email,hashedPassword]
    db.query(insert_query, values, (err, result) => {
    if(err){
        return res.status(500).json({ message: "Error inserting user into table" })
    }
     return res.status(201).json({message:"user registered successfully!"})
})
   
})
 })

}

//handling login 
const login = (req,res) => {

   
   const query = `select * from users where name = ?`;
   db.query(query, req.body.name, (err, result) => {
    if(err){
        return res.status(500).json({message:"database error"})
    }
    if(result.length === 0){
        return res.status(404).json({message:"user not found"})
    }

    const user = result[0];  //if user found, compare passwords

    bcrypt.compare(req.body.password, user.password, (err, ismatch) => {
        if(err){
            return res.status(500).json({message:"error comparing passwords"})
        }
        if(!ismatch){
            return res.status(400).json({message:"Invalid credentials"})
        }

        const token = jwt.sign({id:user.user_id} , process.env.JWT_SECRET)

      
        res.status(200).json({token:token,userDetails:{id:user.user_id,username:user.name},message:"login successful!"})
    })

   })

}

const otpStore = {}
//4-digit OTP generator
const generateOTP = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
}
    //creates nodemailer transport
    const transporter = nodemailer.createTransport({
        service:"gmail",
        auth:{
            user: process.env.EMAIL,   //from which mail we should send otp
            pass: process.env.EMAIL_PASSWORD
        }
    });

//send OTP (if we forget password)
const sendOtp = (req,res) => {
    const q = `select * from  users where email=?`;
 db.query(q, [req.body.email], (err,result) => {
 
    if(result.length === 0){
        return res.status(404).json({message:"user not found"})
    }

    const user = result[0];

    const otp = generateOTP();
    otpStore[user.email] = {otp, expiresAt: Date.now() + 5 * 60 * 1000};  //expires in 5 min


    const mailOptions = {
        from : process.env.EMAIL,
        to: user.email,
        subject: "your OTP code",
        text: `your OTP is: ${otp}. it will expire in 5 minutes`,
    };

    transporter.sendMail (mailOptions, (error, info) => {
        if(error){
            return res.status(500).json({message:"Error sending OTP ",error})
        }
        res.status(200).json({message: "OTP Sent successfully"})
    })
 })
}



//verify otp
const verifyOTP = (req,res) => {
    const {email, otp} = req.body
   if(!email || !otp){
    return res.status(400).json({message:"Email and OTP are required"})
   }

   const storedOtp = otpStore[email];

   if(!storedOtp){
    return res.status(400).json({message:"OTP expired or not found"})
   }

   if(Date.now() > storedOtp.expiresAt){
    delete otpStore[email];
    return res.status(400).json({message:"OTP expired"})
   }

   if(storedOtp.otp !== otp){
    return res.status(400).json({message:"Invalid OTP"})
   }


   delete otpStore[email];
   res.status(200).json({message:"OTP verified successfully!"})

}


//reset password
const resetPassword = async (req, res) => {

    const {email, password} = req.body;

    if(!email || !password){
        return res.status(400).json({message:"Email and password are required."})
    }

    try{
        //hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        //updating password in the db
        const q = `update users set password = ? where email = ?`
        db.query(q, [hashedPassword, email], (err,result) => {
            if(err){
                return res.status(500).json({message:"Error updating password."})
            }
            return res.status(200).json({message:"Password reset successfully!"})
        })
    }catch(error){
        res.status(500).json({message:"server error."})
    }

}


//logout
const logout = (req, res) => {
    try{
        return res.status(200).json({message:"logged out successfully"})
    }catch (err){
       
        return res.status(500).json({message:"logout error"})
    }

}

module.exports = {register,login, sendOtp, verifyOTP, resetPassword, logout}