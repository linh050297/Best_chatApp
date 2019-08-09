require('dotenv').config();
import passport from "passport";
import passportFacebook from "passport-facebook";
import UserModel from "./../../models/user.model";
import {transErrors, transSuccess} from "./../../../lang/vi";

let FacebookStrategy = passportFacebook.Strategy;

//xác thực thông tin người dùng từ facebook

let initPassportFacebook = ()=>{
    passport.use(new FacebookStrategy({
        clientID: process.env.CLIENT_ID_FACEBOOK,
        clientSecret: process.env.CLIENT_SECRET_FACEBOOK,
        callbackURL: process.env.CALLBACK_URL_FACEBOOK,
        profileFields: ["email", "gender", "displayName"],
        passReqToCallback: true
    }, async (req, accessToken, refreshToken, profile, done)=>{
        try {
            let user = await UserModel.findByFacebookUid(profile.uid);

            if(user){
                return done(null, user, req.flash("success", transSuccess.loginSuccess(user.username)));
            }
            
            console.log("profile",profile);
            let newUserItem = {
                username: profile.displayName,
                gender: profile.gender,
                local: { isActive: true },
                facebook: {
                    uid: profile.uid,
                    token: accessToken,
                    email: profile.emails[0].value
                }
            }

            let newUser = await UserModel.createNew(newUserItem);

            return done(null, newUser, req.flash("success", transSuccess.loginSuccess(newUser.username)));
        } catch (error) {
            console.log(error);
            return done(null, false, req.flash("errors", transErrors.server_error))
        }
    }));

    //ghi thông tin user vào session
    passport.serializeUser((user, done)=>{
        done(null, user._id);
    });

    //fun dưới dc gọi bằng passport.session() bên server.js
    //trả về userinfo cho req.user
    passport.deserializeUser((id, done)=>{
        UserModel.findUserById(id)
        .then( user => {
            return done(null, user);
        })
        .catch( error => {
            return done(error, null);
        });
    });
} 

module.exports = initPassportFacebook;