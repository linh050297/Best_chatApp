import mongoose from "mongoose";
import bcrypt from "bcrypt";

let Schema = mongoose.Schema;

let UserSchema = new Schema({
    username: String,
    gender: { type: String, default: 'male' },
    phone: { type: String, default: null },
    address: { type: String, default: null },
    avatar: { type: String, default: "https://res.cloudinary.com/linhhz77/image/upload/v1566554157/yepj8o8cksysadpsxzgb.jpg" },
    role: { type: String, default: "user" },
    local: {
        email: { type: String, trim: true },
        password: String,
        isActive: { type: Boolean, default: false },
        verifyToken: String 
    },
    facebook: {
        uid: String,
        token: String,
        email: { type: String, trim: true }
    },
    google: {
        uid: String,
        token: String,
        email: { type: String, trim: true }
    },
    createdAt: { type: Number, default: Date.now },
    updatedAt: { type: Number, default: null },
    deletedAt: { type: Number, default: null }
});

UserSchema.statics = {
    createNew(item){
        return this.create(item);
    },

    findByEmail(email){
        return this.findOne({"local.email": email}).exec();
    },

    removeById(id){
        return this.findOneAndDelete({ _id: id }).exec(); 
    },

    verify(token){
        return this.findOneAndUpdate(
            { "local.verifyToken" : token },
            { "local.isActive": true, "local.verifyToken" : null }
        ).exec();
    },

    findByToken(token){
        return this.findOne({"local.verifyToken": token}).exec();
    },

    findUserByIdToUpdatePassword(id){
        return this.findById(id).exec();
    },

    findUserByIdForSessionToUse(id){
        return this.findById(id, {"local.password": 0}).exec();
    },

    findCustomDataUser(id){
        return this.findById(id, {_id:1, username: 1, address: 1, avatar: 1}).exec();
    },

    findByFacebookUid(uid){
        return this.findOne({"facebook.uid": uid}).exec();
    },

    findByGoogleUid(uid){
        return this.findOne({"google.uid": uid}).exec();
    },

    updateUserInfo(id, item){
        return this.findByIdAndUpdate(id, item).exec(); //return old item after update
    },

    updatePassword(id, hashedPassword){
        return this.findByIdAndUpdate(id, {"local.password":hashedPassword}).exec(); //return old item after update
    },

    findAllForAddContact(deprecatedUserIds, keyword){
        return this.find({
            $and: [
                {"_id": {$nin: deprecatedUserIds}},
                {"local.isActive": true},
                {$or: [
                    {"username": {"$regex":  new RegExp(keyword, "i")}}, // i có thể search bằng cả chữ hoa và chữ thường
                    {"local.email": {"$regex": new RegExp(keyword, "i")}},
                    {"facebook.email": {"$regex": new RegExp(keyword, "i")}},
                    {"google.email": {"$regex": new RegExp(keyword, "i")}}
                ]}
            ]
        }, {_id:1, username: 1, address: 1, avatar: 1}).exec();
    },

    getNormalUserById(id){
        return this.findById(id, { _id: 1, username: 1, address: 1, avatar: 1 }).exec();
    },
};

UserSchema.methods = {
    comparePassword(password){
        return bcrypt.compare(password, this.local.password); //return a promise has result true or false
    }
}


module.exports = mongoose.model("user", UserSchema);
