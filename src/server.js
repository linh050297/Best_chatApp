require('dotenv').config();
import express  from "express";
import ConnectDB from "./config/connectDB";
import configViewEngine from "./config/viewEngine";
import initRoutes from "./routes/web";
import bodyParser from "body-parser";
import connectFlash from "connect-flash";
import session from "./config/session";
import passport from "passport";
import http from "http";
import socketio from "socket.io";
import initSockets from "./sockets/index";
import cookieParser from "cookie-parser";
import configSocketIo from "./config/socketIO";
// import pem from "pem";
// import https from "https";
// import os from "os";
// import path from "path";


let hostname = process.env.HOST_NAME;
let port = process.env.PORT;

//   if (os.platform() === 'win32') {
//     process.env.OPENSSL_CONF = path.join(__dirname, 'vendor', 'openssl', 'shared', 'openssl.cnf')
//     pem.config({
//       pathOpenSSL: path.join(__dirname,'vendor', 'openssl', os.arch() === 'x64' ? 'x64' : 'ia32', 'openssl.exe'),
//     })
//   }

// pem.createCertificate({ days: 1, selfSigned: true }, function (err, keys) {
//     if (err) {
//         console.log(err.stack);
//         return;
//     }
//     console.log('%s\n\n%s', keys.serviceKey, keys.certificate);

//     let app = express();

// //connect to MongoDB
// ConnectDB();

// //Config session
// configSession(app);

// //config view engine
// configViewEngine(app);

// //enable post data request
// app.use(bodyParser.urlencoded({ extended: true }));

// //enable flash mess
// app.use(connectFlash());

// //config passport js
// app.use(passport.initialize());
// app.use(passport.session());

// //init all routes
// initRoutes(app); 

// https.createServer({ key: keys.serviceKey, cert: keys.certificate }, app).listen(port,hostname, (req, res)=>{
//         console.log(`Hello my friend ,server running at ${hostname}:${port}`);
//     });
// });


let app = express();

//init server with socket.io and express app
let server = http.createServer(app);
let io = socketio(server);

//connect to MongoDB
ConnectDB();

//Config session
session.config(app);

//config view engine
configViewEngine(app);

//enable post data request
app.use(bodyParser.urlencoded({ extended: true }));

//enable flash mess
app.use(connectFlash());

//use cookie parser
app.use(cookieParser()); 

//config passport js
app.use(passport.initialize());
app.use(passport.session());

//init all routes
initRoutes(app); 

configSocketIo.configSocketIo(io);

//init all sockets
initSockets(io);



server.listen(port,hostname, (req, res)=>{
    console.log(`Hello my friend ,server running at ${hostname}:${port}`);
});
