require('dotenv').config();
import nodemailer from "nodemailer";
import { google } from "googleapis";
const OAuth2 = google.auth.OAuth2;

let clientId = process.env.CLIENT_ID;
let clientSecret = process.env.CLIENT_SECRET;
let refreshToken = process.env.REFRESH_TOKEN;
let adminEmail = process.env.MAIL_USER;
let mailHost = process.env.MAIL_HOST;
let mailPort = process.env.MAIL_PORT;


let sendMail = async (to, subject, htmlContent)=>{

    //config
    const oauth2Client = new OAuth2 (
        clientId, //client id
        clientSecret, //client secret
        "https://developers.google.com/oauthplayground" // Redirect URL
    );

    oauth2Client.setCredentials({
        refresh_token: refreshToken
    });

    const tokens = await oauth2Client.refreshAccessToken();
    const accessToken = tokens.credentials.access_token;
        let transporter = nodemailer.createTransport({
            host: mailHost,
            port: mailPort,
            secure: true,
            auth: {
                type: "OAuth2",
                user: adminEmail,
                clientId: clientId,
                clientSecret: clientSecret,
                refreshToken: refreshToken,
                accessToken: accessToken,
                expires: 1484314697598
            }
        });
        let options = {
            from: adminEmail,
            to: to,
            subject: subject,
            html: htmlContent
        };
        return transporter.sendMail(options); //this return a promise
}


module.exports = sendMail;