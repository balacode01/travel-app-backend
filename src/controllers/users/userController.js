const jwt = require("jsonwebtoken");

const {User, OTP} = require("../../models/index.js");
const bcrypt = require('bcrypt');
const { Op } = require("sequelize");


//// register with email ////
const registerUser = async (req,res) => {
    try {
        /// get request body
        const {name, email_address, phone_number, profile_picture, bio, social_links} = req.body;

        if(profile_picture && profile_picture.length > 10*1024*1024){
            return res.status(400).json({message: "Image size too lrage", statusCode: 400});
        }

        const existingUser = await User.findOne({
            where: { [Op.or] : [{email_address}, {phone_number}, {name}]}
        });

        if(existingUser){
            let message = "User already exists";
            if(existingUser.email_address === email_address) message = "Email address already exists";
            else if(existingUser.phone_number === phone_number) message = "Phone number already exists";
            else if (existingUser.name === name) message = "Name already exists";

            return res.status(422).json({ status: 422, message: "User details available",errors: message});
        }

        ////// create new user
        const newUser = await User.create({
            name, email_address, phone_number, profile_picture, bio, social_links: social_links || {},   
        });

        return res.status(201).json({
            message: "User registered successfully",
            statusCode: 201,
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
            return res.status(400).json({ message: "Email or phone number already exists", statusCode: 400 });
        }
        console.log("Internal Server Error", error);
        console.error("Server error", error);
        return res.status(500).json({message: "Internal Server Erroreee"});
    }
}

//// generate OTP
const generateOtp = async (req, res) => {
    try {
        const { phone_number } = req.body;

        const checkUserExists = await User.findOne({ where: { phone_number } });
        if (!checkUserExists) {
            return res.status(401).json({ message: "User not available" });
        }

        const existingOTP = await OTP.findOne({
            where: { phone_number },
            order: [['created_at', 'DESC']]
        });

        if (existingOTP) {
            const currentTime = new Date();
            const otpExpirationTime = new Date(existingOTP.expires_at);

            console.log("Current Time:", currentTime);
            console.log("OTP Expiration Time:", otpExpirationTime);
            console.log("Comparison:", currentTime < otpExpirationTime);

            if (currentTime < otpExpirationTime) {
                return res.status(429).json({
                    message: "OTP already sent. Please wait until it expires.",
                    expiresIn: otpExpirationTime.toISOString()
                });
            }
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expires_at = new Date(Date.now() + 5 * 60 * 1000);

        await OTP.destroy({ where: { phone_number } });
        await OTP.create({ phone_number, otp, expires_at });

        return res.status(201).json({
            statusCode: 201,
            message: "OTP is generated",
            phone_number,
            otp,
            expiresIn: expires_at.toISOString()
        });

    } catch (error) {
        console.error("Error generating OTP:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};




//// verify otp 
const verifyOtp = async (req, res) => {
    try {
        const { phone_number, otp } = req.body;

        // Find OTP record
        const existingOTP = await OTP.findOne({ where: { phone_number, otp } });

        if (!existingOTP) return res.status(400).json({ message: "Invalid OTP" });

        // Check if OTP is expired
        if (new Date() > existingOTP.expires_at) {
            return res.status(400).json({ message: "OTP has expired" });
        }

        // find the user associated with the phone number
        const user = await User.findOne({ where: { phone_number } });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Delete OTP after verification (optional)
        await OTP.destroy({ where: { phone_number } });

        // Generate JWT token
        const token = jwt.sign({ id: user.id, phone_number }, process.env.JWT_SECRET, { expiresIn: '7d' });

        return res.status(201).json({
            statusCode: 201,
            message: "OTP verified successfully", phone_number, token });

    } catch (error) {
        console.error("Error verifying OTP:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};



module.exports = {
    generateOtp,
    registerUser,
    verifyOtp
}