import express  from "express";
let app = express();
let hostname ="localhost";
let port = 1717;

app.get("/hello", (req,res)=>{
    res.send("<h1>heLoooo..</h1>");
});

app.listen(port,hostname, (req, res)=>{
    console.log(`Hello , running at ${hostname}:${port}`);
});
