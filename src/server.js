import express  from "express";
import ConnectDB from "./config/connectDB";
// import ContactModel from "./models/contact.model";
import configViewEngine from "./config/viewEngine";
require('dotenv').config();

let app = express();

//connect to MongoDB
ConnectDB();

//config view engine
configViewEngine(app);

let hostname = process.env.HOST_NAME;
let port = process.env.PORT;

app.get("/testview", async (req,res)=>{
    return res.render("auth/loginRegister");
});

app.get("/master", async (req,res)=>{
    return res.render("main/master");
});

app.listen(port,hostname, (req, res)=>{
    console.log(`Hello my friend ,server running at ${hostname}:${port}`);
});
