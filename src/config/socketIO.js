
import passportSocketIo from "passport.socketio";
import cookieParser from "cookie-parser";
import session from "./../config/session";
require('dotenv').config();

let configSocketIo = (io)=>{
    io.use(passportSocketIo.authorize({
        cookieParser: cookieParser,       // the same middleware you registrer in express
        key:          process.env.SESSION_KEY,       // the name of the cookie where express/connect stores its session_id
        secret:       process.env.SESSION_SECRET,    // the session_secret to parse the cookie
        store:        session.sessionStore,        // we NEED to use a sessionstore. no memorystore please
        success: (data, accept)=>{
            if(!data.user.logged_in){
                return accept("Invalid user", false);
            }
            return accept(null, true)
        },
        fail: (data, message, error, accept)=>{
            if(error){ console.log("Fail to connection to socketIO",message); };
            return accept(new Error(message), false);
        },     
      }));
};

module.exports = { configSocketIo: configSocketIo };
