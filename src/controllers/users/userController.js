const jwt = require("jsonwebtoken");

const {User} = require("../../models/index.js");
const bcrypt = require('bcrypt');
const { where } = require("sequelize");


//// register with email ////
const registerUser = async (req,res) => {
    try {
        /// get request body
        const {name, email_address, phone_number, profile_picture, bio, social_links} = req.body;


        // Check if email or phone number already exists
        const existingEmail = await User.findOne({
            where: { email_address }
        });

        if (existingEmail) {
            return res.status(400).json({ message: "Email already exists" });
        }

        /// check if user already register exists
        const existingPhone = await User.findOne({where: {phone_number}});
        if(existingPhone){
            return res.status(400).json({message: "Phone number already exists"});
        }

        ////// create new user
        const newUser = await User.create({
            name, email_address, phone_number, profile_picture, bio, social_links: social_links || {},   
        });

        return res.status(201).json({
            message: "User registered successfully",
            user: {
                id: newUser.id,
                name: newUser.name,
                email_address: newUser.email_address,
                phone_number: newUser.phone_number,
                profile_picture: newUser.profile_picture,
                bio: newUser.bio,
                social_links: newUser.social_links,
            },
        });
    }
    catch(error){
        if (error.name === "SequelizeUniqueConstraintError") {
            return res.status(400).json({ message: "Email or phone number already exists" });
        }
    
        console.log("Internal Server Error", error);
        return res.status(500).json({message: "Internal Server Error"});
    }
}

//// generate OTP
const generateOtp = async (req,res) => {
    try {
        const { phone_number } = req.body;
        const checkUserExists = await User.findOne({where : {phone_number}});
        if(!checkUserExists){
            return res.status(401).json({message: "User not available"})
        }   function createOTP (){
            return Math.floor(100000 + Math.random() * 900000).toString();;
        }
        const otp = createOTP();
        // otp expire time
        const expires_at = new Date();
        expires_at.setMinutes(expires_at.getMinutes() + 5);

        const expiresIn = expires_at.toLocaleString("en-GB", { 
            day: "2-digit", month: "2-digit", year: "numeric", 
            hour: "2-digit", minute: "2-digit", second: "2-digit", 
            hour12: false 
        });
        return res.status(201).json({
            message: "OTP is generated", 
            phone_number: phone_number, 
            otp: otp, 
            expiresIn
        });
    } catch (error){
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error",
        })
    }
}

module.exports = {
    generateOtp,
    registerUser
}