import express from 'express';
import { home, auth } from "./../controllers/index";

let router = express.Router();

// Init routes
//@param app from express module

let initRoutes = ( app )=>{
    router.get("/", home.getHomeController );
    
    router.get("/login-register", auth.getLoginRegister );

    return app.use("/", router);
};

module.exports = initRoutes;
