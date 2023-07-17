const bcrypt = require('bcrypt');
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const twilio = require("twilio");
require("dotenv").config();

const cors = require('cors')
const bodyParser = require('body-parser');

//SIGNUP

exports.sendotp = async (req, res) => {
    try{
        //get data
        const {phone} = req.body;

        //validate data
        if(!(phone)){
            res.status(400).send("All input is required");
        }

        //check if user already exists
        const existingUser = await User.findOne({phone});

        if(!existingUser){
            //Create entry for new user
            const user = await User.create({ phone }); 
            await user.save();  

            const client = require("twilio")(process.env.accountSid, process.env.authToken);

            client.verify.v2
            .services(process.env.verifySid)
            .verifications.create({
                to: `+91${phone}`,
                channel: "sms",
            })
            .then((verification) => {
                console.log(verification.message);
            });


            return res.status(201).json({
                success: true,
                message: "OTP sent to new user succesfully",
            });
        }

        const client = require("twilio")(process.env.accountSid, process.env.authToken);   //STUPIDITY AT ITS PEAK!

        client.verify.v2
        .services(process.env.verifySid)
        .verifications.create({
            to: `+91${phone}`,
            channel: "sms",
        })
        .then((verification) => {
            console.log(verification.message);
        });


        return res.status(201).json({
            success: true,
            message: "Otp sent to existing user succesfully",
        });
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "User could not be created"
        });
    }
}


//LOGIN

exports.login = async (req, res) => {
    try{
        //data fetch
        const  {phone, otp} = req.body;

        //validate data
        if(!(phone)){
            res.status(400).send("All input is required");
        }

        /*const*/ let user = await User.findOne({phone}); //const is not used because we need to change the value of user later on, (i.e when we add the token to the user object and hide the password)

        if(!user){
            return res.status(400).json({
                success: false,
                message: "user does not exist"
            });
        }

        //verify with twilio
        const accountSid = "ACd21fdc5b803d2e2494869a05f28a4aac";
        const authToken = process.env.authToken;
        const verifySid = "VA7687f794ba597450e29f5209b7b83d34";
        const client = require("twilio")(process.env.accountSid, process.env.authToken);   //STUPIDITY AT ITS PEAK!


        client.verify.v2
        .services(process.env.verifySid)
        .verificationChecks.create({
            to: `+91${phone}`,
            code: otp,
        })
        .then((verification_check) => {
            console.log(verification_check.status);

            if(verification_check.status == "approved"){
                //create payload
            const payload = {
                phone: user.phone,
                id: user._id,
                queryCounter: user.queryCounter
            }

            //create JWT
            let token = jwt.sign(payload,
                process.env.JWT_SECRET,
                {
                    expiresIn: "1h"
                }
                );

            user = user.toObject(); //convert the user object to a plain object, otherwise we cannot add new fields to it (like token)w hy can't we add new fields to it you say? because it is a mongoose object and mongoose objects are immutable. 
            user.token = token; //make a new field called 'token' in user and assign the token to it

            const options = {
                httpOnly: true, //cookie is not accessible via client side script
                expiresIn: new Date(Date.now() + 1*24*60*60*1000) //cookie will expire after 1 day
            }
            res.cookie('token', token, options).status(200).json({ //this is a method to return a cookie to the client and also send a response in json format both at the same time.
                success: true,
                chatHistory: user.chatHistory,
                token: token
            }) // options id the name given to the cookie, token is the value/payload/data of the cookie
        }
        else{
            return res.status(400).json({
                success: false,
                message: "OTP is incorrect"
            });
        }
    });
    } //end of try
    catch(error){
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "User could not be logged in"
        });
    }
}