require('dotenv').config();
import passport from "passport";
import passportGoogle from "passport-google-oauth";
import UserModel from "./../../models/user.model";
import {transErrors, transSuccess} from "./../../../lang/vi";

let GoogleStrategy = passportGoogle.OAuth2Strategy;

//xác thực thông tin người dùng từ google

let initPassportGoogle = ()=>{
    passport.use(new GoogleStrategy({
        clientID: process.env.GG_APP_ID,
        clientSecret: process.env.GG_APP_SECRET,
        callbackURL: process.env.GG_CALLBACK_URL,
        passReqToCallback: true
    }, async (req, accessToken, refreshToken, profile, done)=>{
        try {
            let user = await UserModel.findByGoogleUid(profile.uid);

            if(user){
                return done(null, user, req.flash("success", transSuccess.loginSuccess(user.username)));
            }
            
            // console.log("profileGoogle::::",profile);
            let usernameByEmailGoogle = '';
            if (profile.displayName === undefined){
                usernameByEmailGoogle = profile.emails[0].value.split("@")[0]
            }else{
                usernameByEmailGoogle = profile.displayName
            }
            let newUserItem = {
                username: usernameByEmailGoogle,
                gender: profile.gender,
                local: { isActive: true },
                google: {
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
        UserModel.findUserByIdForSessionToUse(id)
        .then( user => {
            return done(null, user);
        })
        .catch( error => {
            return done(error, null);
        });
    });
} 

module.exports = initPassportGoogle;