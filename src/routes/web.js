import express from 'express';
import { home, auth , user, contact, notification, message} from "./../controllers/index";
import { authValid, userValidationIndex, contactValid, messageValid } from "./../validation/index";
import initPassportLocal from "./../controllers/passportController/local";
import initPassportFacebook from "./../controllers/passportController/facebook";
import initPassportGoogle from "./../controllers/passportController/google";
import passport from "passport";

//init all passport
initPassportLocal();
initPassportFacebook();
initPassportGoogle();
let router = express.Router();

// Init routes
//@param app from express module

let initRoutes = ( app )=>{
    
    router.get("/login-register", auth.checkLoggedOut, auth.getLoginRegister );

    router.post("/register", auth.checkLoggedOut, authValid.register, auth.postRegister);

    router.get("/verify/:token", auth.checkLoggedOut, auth.verifyAccount);

    router.post("/login", auth.checkLoggedOut, passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login-register",
        successFlash: true,
        failureFlash: true
    }));

    router.get("/auth/facebook", auth.checkLoggedOut, passport.authenticate("facebook", {scope: ["email"]}));
    router.get("/auth/facebook/callback", auth.checkLoggedOut, passport.authenticate("facebook",{
        successRedirect: "/",
        failureRedirect: "/login-register",
    }));

    router.get("/auth/google", auth.checkLoggedOut, passport.authenticate("google", {scope: ["email"]}));
    router.get("/auth/google/callback", auth.checkLoggedOut, passport.authenticate("google",{
        successRedirect: "/",
        failureRedirect: "/login-register",
    }));

    router.get("/", auth.checkLoggedIn, home.getHomeController );
    router.get("/logout", auth.checkLoggedIn, auth.getLogout);

    router.put("/user/update-avatar", auth.checkLoggedIn, user.updateAvatar );
    router.put("/user/update-info", auth.checkLoggedIn, userValidationIndex.updateInfo, user.updateInfo);
    router.put("/user/update-password", auth.checkLoggedIn, userValidationIndex.updatePassword, user.updatePassword );

    router.get("/contact/find-users/:keyword", auth.checkLoggedIn, contactValid.findUsersContact, contact.findUsersContact);
    router.post("/contact/add-new", auth.checkLoggedIn, contact.addNew);
    router.delete("/contact/remove-request-contact-sent", auth.checkLoggedIn, contact.removeRequestContactSent);
    router.delete("/contact/remove-request-contact-received", auth.checkLoggedIn, contact.removeRequestContactReceived);
    router.delete("/contact/remove-contact", auth.checkLoggedIn, contact.removeContact);
    router.put("/contact/approve-request-contact-received", auth.checkLoggedIn, contact.approveRequestContactReceived);
    router.get("/contact/read-more-contacts", auth.checkLoggedIn, contact.readMoreContacts);
    router.get("/contact/read-more-contacts-send", auth.checkLoggedIn, contact.readMoreContactsSend);
    router.get("/contact/read-more-contacts-received", auth.checkLoggedIn, contact.readMoreContactsReceived);

    router.get("/notification/read-more", auth.checkLoggedIn, notification.readMore);
    router.put("/notification/mark-all-as-read", auth.checkLoggedIn, notification.markAllAsRead);
 
    router.post("/message/add-new-text-emoji", auth.checkLoggedIn, messageValid.checkMessageLength , message.addNewTextEmoji);

    return app.use("/", router);
};

module.exports = initRoutes;
