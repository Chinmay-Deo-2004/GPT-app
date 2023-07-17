const express = require("express");
const router = express.Router();
const User = require("../models/User");
const cors = require('cors')

express().use(express.json());
express().use(cors());



const {sendotp, login} = require("../controllers/Auth");
const {auth, isAskable, options} = require("../middlewares/auth");

router.post("/sendotp", sendotp);
router.post("/login", login);

router.post("/getresponse", auth, isAskable, async (req, res) => {

    //finding the user who made the request in the database
    const userId = req.user._id;
    const convoId = req.body.convoId; //seriously bruh, you can't even destructure a simple field out of a request body?
    const phone = req.user.phone;

    const user = await User.findOne({phone}); //find by id
    console.log("found user: ",user);

    //check if the user has a conversation with convoId
    const foundconversation = user.chatHistory.find(conversation => conversation.id === convoId);
    console.log(`found convo  of ${convoId}: `, foundconversation); //undefined if not found

    if(foundconversation === undefined){
        //create a new conversation with concoId=1
        const conversation = {
            id: convoId,
            messages: []
        }
        console.log(conversation);
        // user.chatHistory[convoId] = (conversation);
        user.chatHistory.push(conversation);
        await user.save();
        console.log("new conversation created");
    }



    //removing the wildcard from the Access-Control-Allow-Origin header will not work. It will still give the same error. The reason is that the browser will not allow the response to be sent to a different origin. So, we have to explicitly mention the origin in the Access-Control-Allow-Origin header.



    console.log(req.cookies);
    const question = req.body.question;
    console.log(question);

    const options = {
        method: "POST",
        headers: {
            'authorization': `Bearer ${process.env.API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
                {role: "assistant", content: "You are a helpul AI assistant."},
                {role: "user", content: question}
            ],
            max_tokens: 150
        })
    }
    console.log("calling api")
    try{

        const response = await fetch('https://api.openai.com/v1/chat/completions', options);
        const data = await response.json();

        const answer = data.choices[0].message.content;

        res.status(200).json({
            success: true,
            message: answer
        })
        console.log(answer);


        if(foundconversation)
        {
            foundconversation.messages.push(
                { 
                    question: question,
                    answer: answer 
                }
            )

            user.queryCounter = user.queryCounter + 1;
            await user.save();
            console.log("conversation saved");
            console.log(user);
        }

        console.log(user.chatHistory.conversation);
        user.chatHistory.conversation.messages.push(
            { 
                question: question,
                answer: answer 
            }
        )
        user.queryCounter = user.queryCounter + 1;
        await user.save();
        console.log("conversation saved");
        console.log(user);



        // await founduser.save();
        console.log("conversation saved");

    }
    catch(err){
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
    console.log("api called")

})

router.post("/getConversation", auth, async (req, res) => {
    console.log(req);
    const convoId = req.body.convoId;
    const phone = req.user.phone;
    console.log(convoId, phone);

    //find conversation by id in the database

    const user = await User.findOne({phone});
    console.log(user);
    const conversation = user.chatHistory.find(conversation => conversation.id === convoId);

    if(conversation === undefined){
        res.status(404).json({
            success: false,
            message: "Conversation not found"
        })
    }
    else{
        res.status(200).json({
            success: true,
            message: conversation
        })
    }

});

module.exports = router;