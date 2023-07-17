const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");


//AUTHENTICATION MIDDLEWARE

exports.auth = async (req, res, next) => {
    //allowing the frontend to access the backend
    try{

        //extract JWT token
        console.log(req.cookies);
    
        const token = req.cookies.token;

        if(!token){
            console.log("no token");
            return res.status(401).json({errorMessage: "Unauthorized"});
        }

        //verify JWT token
        try{
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);  //decode is an abject that the jwt.verify method returns. It contains the payload that we passed in the jwt.sign method in the Auth controller. it is basically the deecrypted jwt token 

            //attach the user object to the request object
            req.user = decode; //WHY THIS?? //check the middleware for users below, there we are going to check the role of user. That will only be possible if we attach the user object to the request object.
            console.log(req.user, "this part is working"); //if req.user is undefined, then the token is invalid

            next(); //move on to the next middleware
        }
        catch(error){
            console.log(error);
            return res.status(401).json({ 
                success: false,
                message: "Invalid token"
            });
        }
    }
    catch(error){
        console.log(error);
        return res.status(401).json({ 
            success: false,
            message: "Internal server error"
        });
    }   
}

//AUTHORIZATION MIDDLEWARE

exports.isAskable = async (req, res, next) => {
    try{
        const user = await User.findById(req.user.id);
        if(user.queryCounter>=10){
            return res.status(401).json({
                success: false,
                message: "You have exceeded your query limit, please pay to continue using the service"
            });
        }
        console.log("this part is working as well");
        next();
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}