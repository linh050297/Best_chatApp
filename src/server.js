import express  from "express";
import ConnectDB from "./config/connectDB";
// import ContactModel from "./models/contact.model";
import configViewEngine from "./config/viewEngine";
import initRoutes from "./routes/web";

require('dotenv').config();

let app = express();

//connect to MongoDB
ConnectDB();

//config view engine
configViewEngine(app);

//init all routes
initRoutes(app);

let hostname = process.env.HOST_NAME;
let port = process.env.PORT;



app.listen(port,hostname, (req, res)=>{
    console.log(`Hello my friend ,server running at ${hostname}:${port}`);
});
