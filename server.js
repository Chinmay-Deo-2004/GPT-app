const PORT = 5500;

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const app = express()

app.use(cors({origin: 'http://127.0.0.1:5500', credentials: true})); 
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});


mongoose.connect("mongodb://127.0.0.1:27017/FGPT_official_DB", {
    useNewurlParser:true,
    useUnifiedTopology:true
})
.then(() => {console.log("connection succesful")})
.catch((error) => {console.log(error)})
.catch((error) => {console.log(error)})

//import routes and mount them
const user = require("./routes/user");
app.use("/api/v1", user);