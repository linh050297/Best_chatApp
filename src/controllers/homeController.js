import { notification } from "./../services/index";

let getHomeController = async (req, res)=>{
    //only 10 item
    let notifications = await notification.getNotifications(req.user._id);
    //get all notification unread
    let countNotifUnread = await notification.countNotifUnread(req.user._id);
    
    return res.render("main/home/home",{
        errors: req.flash("errors"),
        success: req.flash("success"),  //nhận mảng error từ postRegister và chuyền sang view auth/master
        user: req.user,
        notifications: notifications,
        countNotifUnread: countNotifUnread
    });
};

module.exports = { getHomeController: getHomeController };