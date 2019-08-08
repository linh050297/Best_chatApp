require('dotenv').config();
import express  from "express";
import ConnectDB from "./config/connectDB";
// import ContactModel from "./models/contact.model";
import configViewEngine from "./config/viewEngine";
import initRoutes from "./routes/web";
import bodyParser from "body-parser";
import connectFlash from "connect-flash";
import configSession from "./config/session";
import passport from "passport";



let app = express();

//connect to MongoDB
ConnectDB();

//Config session
configSession(app);

//config view engine
configViewEngine(app);

//enable post data request
app.use(bodyParser.urlencoded({ extended: true }));

//enable flash mess
app.use(connectFlash());

//config passport js
app.use(passport.initialize());
app.use(passport.session());

//init all routes
initRoutes(app);

let hostname = process.env.HOST_NAME;
let port = process.env.PORT;



app.listen(port,hostname, (req, res)=>{
    console.log(`Hello my friend ,server running at ${hostname}:${port}`);
});
