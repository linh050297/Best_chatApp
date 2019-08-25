import mongoose from "mongoose";

let Schema = mongoose.Schema;

let NotificationSchema = new Schema({
    senderId: String,
    receiverId: String,
    type: String,
    isRead: { type: Boolean, default: false },
    createdAt: { type: Number, default: Date.now },
});

NotificationSchema.statics = {
    createNew(item){
        return this.create(item);
    },

    removeRequestContactNotification(senderId, receiverId, type){
        return this.deleteOne({
            $and: [
                {"senderId": senderId},
                {"receiverId": receiverId},
                {"type": type}
            ]
        }).exec();
    },

    getByUserIdAndLimit(userId, limit){
        return this.find({
            "receiverId" : userId
        }).sort({"createAt" : -1}).limit(limit).exec();
    },

    countNotifUnread(userId){
        return this.countDocuments({
            $and: [
                {"receiverId" : userId},
                {"isRead": false}
            ]
        }).sort({"createAt" : -1}).exec();
    },

    //get number of nitification with skip
    readMore(userId, skip, limit){
        return this.find({
            "receiverId" : userId
        }).sort({"createAt" : -1}).skip(skip).limit(limit).exec();
    },

    markAllAsRead(userId, targetUsers){
        return this.updateMany({
            $and:[
                {"receiverId" : userId},
                {"senderId": {$in: targetUsers}}
            ]
        }, {"isRead": true}).exec();
    },


}

const NOTIFICATION_TYPES = {
    ADD_CONTACT: "add_contact",
};

const NOTIFICATION_CONTENT = {
    getContent: (notificationType, isRead, userId, username, userAvatar)=>{
        if(notificationType === NOTIFICATION_TYPES.ADD_CONTACT){
            if(!isRead){
                return `<div class="notif-readed-false" data-uid="${ userId }">
                            <img class="avatar-small" src ="${ userAvatar }" alt=""> 
                            <strong>${ username }</strong> đã gửi cho bạn một lời mời kết bạn!
                        </div>`;
            } 
                return `<div class="" data-uid="${ userId }">
                            <img class="avatar-small" src ="${ userAvatar }" alt=""> 
                            <strong>${ username }</strong> đã gửi cho bạn một lời mời kết bạn!
                        </div>`;
        };
        return "No mathching with any notification type!";
    }
}


module.exports = {
    model: mongoose.model("notification", NotificationSchema),
    types: NOTIFICATION_TYPES,
    contents: NOTIFICATION_CONTENT
};