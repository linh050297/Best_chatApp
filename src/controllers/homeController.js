import { notification, contact, message } from "./../services/index";

let getHomeController = async (req, res)=>{
    //only 10 item
    let notifications = await notification.getNotifications(req.user._id);
    //get all notification unread
    let countNotifUnread = await notification.countNotifUnread(req.user._id);
    //get contact 10 item per time
    let contacts = await contact.getContacts(req.user._id);
    //get contact send
    let contactsSend = await contact.getContactsSend(req.user._id);
    //get contact received
    let contactsReceived = await contact.getContactsReceived(req.user._id);

    //count contacts
    let countAllContacts = await contact.countAllContacts(req.user._id);
    let countAllContactsSend = await contact.countAllContactsSend(req.user._id);
    let countAllContactsReceived = await contact.countAllContactsReceived(req.user._id);

    let getAllConversationItems = await message.getAllConversationItems(req.user._id);
    let allConversations = getAllConversationItems.allConversations;
    let userConversations = getAllConversationItems.userConversations;
    let groupConversations = getAllConversationItems.groupConversations;

    
    return res.render("main/home/home",{
        errors: req.flash("errors"),
        success: req.flash("success"),  //nhận mảng error từ postRegister và chuyền sang view auth/master
        user: req.user,
        notifications: notifications,
        countNotifUnread: countNotifUnread,
        contacts: contacts,
        contactsSend: contactsSend,
        contactsReceived: contactsReceived,
        countAllContacts: countAllContacts,
        countAllContactsSend: countAllContactsSend,
        countAllContactsReceived: countAllContactsReceived,
        allConversations: allConversations,
        userConversations: userConversations,
        groupConversations: groupConversations
    });
};

module.exports = { getHomeController: getHomeController };