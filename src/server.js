import express  from "express";
import ConnectDB from "./config/connectDB";
import ContactModel from "./models/contact.model";
require('dotenv').config();

let app = express();

//connect to MongoDB
ConnectDB();

let hostname = process.env.HOST_NAME;
let port = process.env.PORT;

app.get("/testdb", async (req,res)=>{
    try {
        let item = {
            userId: "1717",
            contactId: "abcbcd",
        };
        let contact = await ContactModel.createNew(item);
        res.send(contact);
    } catch (error) {
        console.log(error);
    }
});

app.listen(port,hostname, (req, res)=>{
    console.log(`Hello my friend ,server running at ${hostname}:${port}`);
});
