import NotificationModel from "./../models/notifications.model";
import UserModel from "./../models/user.model";
const LIMIT_NUMBER_TAKEN = 10;

let getNotifications = (currentUserId)=>{
    return new Promise ( async (resolve, rejects)=>{
        try {
            let notifications = await NotificationModel.model.getByUserIdAndLimit(currentUserId, LIMIT_NUMBER_TAKEN);

            let getNotifContents = notifications.map( async (notification)=>{ //return về mảng mới
                let sender = await UserModel.findUserById(notification.senderId);
                return NotificationModel.contents.getContent(notification.type, notification.isRead, sender._id, sender.username, sender.avatar);
            });
            resolve(await Promise.all(getNotifContents)); //do hàm map không đợi await thực thi xong mà nó cứ return ra nên dùng Promise.all để đợi tất cả cùng xong.
        } catch (error) {
            rejects(error);
        }
    })
}
//count all notfication unread
let countNotifUnread = (currentUserId)=>{
    return new Promise ( async (resolve, rejects)=>{
        try {
            let notificationsUnread = await NotificationModel.model.countNotifUnread(currentUserId);
            resolve(notificationsUnread);
        } catch (error) {
            rejects(error);
        }
    })
};

//read more notification max 10 item one time
let readMore = (currentUserId, skipNumberNotif)=>{
    return new Promise ( async (resolve, rejects)=>{
        try {
            let newNotifications = await NotificationModel.model.readMore(currentUserId, skipNumberNotif, LIMIT_NUMBER_TAKEN);
            
            let getNotifContents = newNotifications.map( async (notification)=>{ //return về mảng mới
                let sender = await UserModel.findUserById(notification.senderId);
                return NotificationModel.contents.getContent(notification.type, notification.isRead, sender._id, sender.username, sender.avatar);
            });
            resolve(await Promise.all(getNotifContents)); //do hàm map không đợi await thực thi xong mà nó cứ return ra nên dùng Promise.all để đợi tất cả cùng xong.

        } catch (error) {
            rejects(error);
        }
    });
};

//mark all as read
let markAllAsRead = (currentUserId, targetUsers)=>{
    return new Promise ( async (resolve, rejects)=>{
        try {
            await NotificationModel.model.markAllAsRead(currentUserId, targetUsers);
            resolve(true);

        } catch (error) {
            console.log(`Error when mark notifications as read: ${error}`);
            rejects(false);
        }
    });
};

module.exports = {  getNotifications: getNotifications,
                    countNotifUnread:countNotifUnread,
                    readMore: readMore,
                    markAllAsRead: markAllAsRead };