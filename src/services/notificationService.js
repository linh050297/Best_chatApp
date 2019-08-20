import NotificationModel from "./../models/notifications.model";
import UserModel from "./../models/user.model";

let getNotifications = (currentUserId, limit = 10)=>{
    return new Promise ( async (resolve, rejects)=>{
        try {
            let notifications = await NotificationModel.model.getByUserIdAndLimit(currentUserId, limit);

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

module.exports = { getNotifications: getNotifications };