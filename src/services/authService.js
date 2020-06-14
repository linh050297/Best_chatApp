import UserModel from "./../models/user.model";
import bcrypt from "bcrypt";
import uuidv4 from "uuid/v4";
import { rejects } from "assert";
import { transErrors, transSuccess, transMail } from "./../../lang/vi";
import sendMail from "./../config/mailer";

let saltRounds = 7;

let register =  ( email, gender, password, protocol, host)=>{
    return new Promise( async ( resolve, reject )=>{

        let userByEmail = await UserModel.findByEmail(email); 
        if( userByEmail ){
            if(userByEmail.deleteAt != null){
                return reject(transErrors.account_removed);
            }
            if( !userByEmail.local.isActive ){
                return reject( transErrors.account_not_active );
            }
            return reject(transErrors.account_in_use);
        }
        let salt = bcrypt.genSaltSync(saltRounds);

        let userItem = {
            username: email.split("@")[0],
            gender: gender,
            local: {
                email: email,
                password: bcrypt.hashSync(password, salt),
                verifyToken: uuidv4()
            }
        };

        let user = await UserModel.createNew(userItem);
        //SEND MAIL
        let linkVerify = `${protocol}://${host}/verify/${user.local.verifyToken}`;
        sendMail(email, transMail.subject, transMail.template(linkVerify))
        .then((success) => {
            resolve(transSuccess.emailSended(user.local.email));
        })
        .catch( async (error)=>{
            //remove user when send mail is fail
            await UserModel.removeById(user._id);
            reject(transMail.send_failed);
        });
        // resolve(transSuccess.userCreated(user.local.email));
    });
    
};

let verifyAccount = (token)=>{
    return new Promise( async (resolve, rejects)=>{
        let userByToken = await UserModel.findByToken(token);
        if(!userByToken){
            return rejects(transErrors.token_undefined);
        }
        
        await UserModel.verify(token);
        resolve(transSuccess.account_active);
    });
};

module.exports = {
    register : register,
    verifyAccount: verifyAccount
}