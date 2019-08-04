var express = require("express");
var app = express();
var hostname ="localhost";
var port = 1717;

app.get("/hello", (req,res)=>{
    res.send("<h1>heLoooo..</h1>");
});

app.listen(port,hostname, (req, res)=>{
    console.log(`Hello , running at ${hostname}:${port}`);
});