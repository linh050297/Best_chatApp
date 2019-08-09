import UserModel from "./../models/user.model";

let updateUser = (id, item)=>{
    return UserModel.updateUserInfo(id, item);
};

module.exports = {
    updateUser: updateUser
}