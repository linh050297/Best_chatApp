import multer from "multer";
import { app } from "./../config/app";
import { transErrors, transSuccess } from "./../../lang/vi";
import uuidv4 from "uuid/v4";
import {user} from "./../services/index";
import fsExtra from "fs-extra";

let storageAvatar = multer.diskStorage({
    destination: (req, file, callback)=>{
        callback(null, app.avatar_directory);
    },
    filename: (req, file, callback)=>{
        let math = app.avatar_type;
        if(math.indexOf(file.mimetype) === -1){
            return callback(transErrors.avatar_type, null);
        }

        let avatarName = `${Date.now()}-${uuidv4()}-${file.originalname}`;
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
            let updateUserItem = {
                avatar: req.file.filename,
                updateAt: Date.now()
            };
            //update user
            let userUpdate = await user.updateUser(req.user._id, updateUserItem);
            //remove old avatar
            if(userUpdate.avatar != "avatar-default.jpg"){
                await fsExtra.remove(`${app.avatar_directory}/${userUpdate.avatar}`); //do findByIdAndUpdate bên UserModel khi update sẽ trả về dữ liệu cũ nên ở đây userUpdate.avatar sẽ là hình cũ
            }
            
            let result = {
                message: transSuccess.avatar_updated,
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

module.exports = { updateAvatar: updateAvatar };