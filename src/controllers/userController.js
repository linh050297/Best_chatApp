import multer from "multer";
import { app } from "./../config/app";
import { transErrors, transSuccess } from "./../../lang/vi";
import {user} from "./../services/index";
import fsExtra from "fs-extra";
import { validationResult } from "express-validator/check";
import  cloudinary   from "cloudinary";
require("./../config/cloudinary");

let storageAvatar = multer.diskStorage({
    // destination: (req, file, callback)=>{
    //     callback(null, app.avatar_directory);
    //     // console.log("file",file);
    // },
    filename: (req, file, callback)=>{
        let math = app.avatar_type;
        if(math.indexOf(file.mimetype) === -1){
            return callback(transErrors.avatar_type, null);
        }

        let avatarName = file.originalname;
        callback(null, avatarName);
    }
});

let avatarUploadFile = multer({
    storage: storageAvatar,
    limits: {fileSize: app.avatar_limit_size}
}).single("avatar"); // trường avatar này phải giống trong trường formData trong file updateUser.js

let updateAvatar = (req, res)=>{
    avatarUploadFile(req, res, async (error)=>{
        if(error){
            if(error.message){
                return res.status(500).send(transErrors.avatar_size);
            }
            return res.status(500).send(error)
        }
        try {
            let resultToCloudinary = await cloudinary.v2.uploader.upload(req.file.path);
            // console.log("resultToCloudinary",resultToCloudinary);
            let updateUserItem = {
                avatar: resultToCloudinary.secure_url,
                updateAt: Date.now()
            };
            
            //update user
            let userUpdate = await user.updateUser(req.user._id, updateUserItem);
            let publicIdImg = userUpdate.avatar.replace(/^.*[\\\/]/, '').split('.')[0];
            //remove old avatar except defaultAvatar
            if(publicIdImg != "yepj8o8cksysadpsxzgb"){
              let removeImg =   await cloudinary.uploader.destroy(publicIdImg); //do findByIdAndUpdate bên UserModel khi update sẽ trả về dữ liệu cũ nên ở đây userUpdate.avatar sẽ là hình cũ
                if(removeImg = "ok"){
                    console.log(`Remove image ${publicIdImg} success!!!`);
                }
            }
            
            let result = {
                message: transSuccess.user_info_updated,
                imgSrc: `/images/users/${req.file.filename}`
            }
            return res.status(200).send(result);
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
        // console.log("req.file",req.file);
    })
}

let updateInfo = async (req, res)=>{
    let errorArr = []; 
    // console.log("req::::",req);
    let validationErrors = validationResult(req);
    if( !validationErrors.isEmpty() ){
        let errors = Object.values(validationErrors.mapped());
        // console.log("errors:::",errors);
        errors.forEach(item => {
            errorArr.push( item.msg )
        });
        
        return res.status(500).send(errorArr);

    }

    try {

        let updateUserItem = req.body;
        await user.updateUser(req.user._id, updateUserItem);
        let result = {
            message: transSuccess.user_info_updated
        }
        return res.status(200).send(result);

    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

let updatePassword = async (req ,res)=>{
    let errorArr = [];
    let validationErrors = validationResult(req);
    if( !validationErrors.isEmpty() ){
        let errors = Object.values(validationErrors.mapped());
        errors.forEach(item => {
            errorArr.push( item.msg )
        });
        
        return res.status(500).send(errorArr); // chuyển biến error sang login-register

    }
    try {
        let updateUserItem = req.body;
        await user.updateUserPassword(req.user._id, updateUserItem);

        let result = {
            message: transSuccess.user_password_updated
        };
        return res.status(200).send(result);
    } catch (error) {
        return res.status(500).send(error);
    }
}

module.exports = { updateAvatar: updateAvatar,
                    updateInfo: updateInfo,
                    updatePassword: updatePassword };