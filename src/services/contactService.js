import ContactModel from "./../models/contact.model";
import UserModel from "./../models/user.model";
import NotificationModel from "./../models/notifications.model";
import _ from "lodash";
const LIMIT_NUMBER_TAKEN = 10;

let findUsersContact = (currentUserId, keyword)=>{
    return new Promise(async (resolve, reject)=>{
        let deprecatedUserIds = [currentUserId];
        let contactsByUser = await ContactModel.model.findAllByUser(currentUserId);
        contactsByUser.forEach((contact)=>{
            deprecatedUserIds.push(contact.userId);
            deprecatedUserIds.push(contact.contactId);
        });

        deprecatedUserIds = _.uniqBy(deprecatedUserIds);//remove duplicated
        let users = await UserModel.findAllForAddContact(deprecatedUserIds, keyword);
        resolve(users);
    });
};

let addNew = (currentUserId, contactId)=>{
    return new Promise(async (resolve, reject)=>{
        let contactExists = await ContactModel.model.checkExists(currentUserId, contactId);
        if(contactExists){
            return reject(false);
        }
        //create contact
        let newContactItem = {
            userId: currentUserId,
            contactId: contactId
        };
        let newContact = await ContactModel.model.createNew(newContactItem);
        //create notification
        let notificationItem = {
            senderId: currentUserId,
            receiverId: contactId,
            type: NotificationModel.types.ADD_CONTACT,
        }
        await NotificationModel.model.createNew(notificationItem);
        resolve(newContact);
    });
};

let removeRequestContactSent = (currentUserId, contactId)=>{
    return new Promise(async (resolve, reject)=>{
        let removeReq = await ContactModel.model.removeRequestContactSent(currentUserId, contactId);
        if(removeReq.n === 0){
            return reject(false);
        }
        //remove notification
        await NotificationModel.model.removeRequestContactSentNotification(currentUserId, contactId, NotificationModel.types.ADD_CONTACT);
        resolve(true);
    });
};

let removeRequestContactReceived = (currentUserId, contactId)=>{
    return new Promise(async (resolve, reject)=>{
        let removeReq = await ContactModel.model.removeRequestContactReceived(currentUserId, contactId);
        if(removeReq.n === 0){
            return reject(false);
        }
        //remove notification
        // await NotificationModel.model.removeRequestContactReceivedNotification(currentUserId, contactId, NotificationModel.types.ADD_CONTACT);
        resolve(true);
    }); 
};

let removeContact = (currentUserId, contactId)=>{
    return new Promise(async (resolve, reject)=>{
        let removeReq = await ContactModel.model.removeContact(currentUserId, contactId);
        if(removeReq.n === 0){
            return reject(false);
        }
        resolve(true);
    }); 
};

let getContacts = (currentUserId)=>{
    return new Promise(async (resolve, reject)=>{
        try {
            let contacts = await ContactModel.model.getContacts(currentUserId, LIMIT_NUMBER_TAKEN);
            let users = contacts.map( async (contact)=>{ //return về mảng mới
                if(contact.contactId == currentUserId){
                    return await UserModel.findUserById(contact.userId);
                }else{
                    return await UserModel.findUserById(contact.contactId);
                }
                
            });
            resolve(await Promise.all(users)); //do hàm map không đợi await thực thi xong mà nó cứ return ra nên dùng Promise.all để đợi tất cả cùng xong.
        } catch (error) {
            reject(error)
        };
    });
};

let getContactsSend = (currentUserId)=>{
    return new Promise(async (resolve, reject)=>{
        try {
            let contacts = await ContactModel.model.getContactsSend(currentUserId, LIMIT_NUMBER_TAKEN);
            let users = contacts.map( async (contact)=>{ //return về mảng mới
                return await UserModel.findUserById(contact.contactId);
            });
            resolve(await Promise.all(users)); //do hàm map không đợi await thực thi xong mà nó cứ return ra nên dùng Promise.all để đợi tất cả cùng xong.
        } catch (error) {
            reject(error)
        };
    });
};

let getContactsReceived = (currentUserId)=>{
    return new Promise(async (resolve, reject)=>{
        try {
            let contacts = await ContactModel.model.getContactsReceived(currentUserId, LIMIT_NUMBER_TAKEN);
            let users = contacts.map( async (contact)=>{ //return về mảng mới
                return await UserModel.findUserById(contact.userId);
            });
            resolve(await Promise.all(users)); //do hàm map không đợi await thực thi xong mà nó cứ return ra nên dùng Promise.all để đợi tất cả cùng xong.
        } catch (error) {
            reject(error)
        };
    });
};

let countAllContacts = (currentUserId)=>{
    return new Promise ( async (resolve, reject)=>{
        try {
            let numberOfContacts = await ContactModel.model.countAllContacts(currentUserId);
            resolve(numberOfContacts);
        } catch (error) {
            reject(error);
        };
    });
};

let countAllContactsSend = (currentUserId)=>{
    return new Promise ( async (resolve, reject)=>{
        try {
            let numberOfContacts = await ContactModel.model.countAllContactsSend(currentUserId);
            resolve(numberOfContacts);
        } catch (error) {
            reject(error);
        };
    });
};

let countAllContactsReceived = (currentUserId)=>{
    return new Promise ( async (resolve, reject)=>{
        try {
            let numberOfContacts = await ContactModel.model.countAllContactsReceived(currentUserId);
            resolve(numberOfContacts);
        } catch (error) {
            reject(error);
        };
    });
};

let readMoreContacts = (currentUserId, skipNumberContact)=>{
    return new Promise ( async (resolve, reject)=>{
        try {
            let contactType = "contact";
            let newContacts = await ContactModel.model.readMoreContacts(currentUserId, skipNumberContact, LIMIT_NUMBER_TAKEN);

            let users = newContacts.map( async (contact)=>{ //return về mảng mới
                if(contact.contactId == currentUserId){
                    let user = await UserModel.findCustomDataUser(contact.userId);
                    if(user.address == null){user.address = ""};
                    return await ContactModel.contents.getContent(contactType, user._id, user.avatar, user.username, user.address);
                }else{
                    let user = await UserModel.findCustomDataUser(contact.contactId);
                    if(user.address == null){user.address = ""};
                    return await ContactModel.contents.getContent(contactType, user._id, user.avatar, user.username, user.address)
                }
                
            });
            resolve(await Promise.all(users)); //do hàm map không đợi await thực thi xong mà nó cứ return ra nên dùng Promise.all để đợi tất cả cùng xong.
        } catch (error) {
            reject(error);
        };
    });
};

let readMoreContactsSend = (currentUserId, skipNumberContact)=>{
    return new Promise ( async (resolve, reject)=>{
        try {
            let contactType = "sent";
            let contacts = await ContactModel.model.readMoreContactsSend(currentUserId, skipNumberContact, LIMIT_NUMBER_TAKEN);
            let users = contacts.map( async (contact)=>{ //return về mảng mới
                let user = await UserModel.findCustomDataUser(contact.contactId);
                if(user.address == null){user.address = ""};
                return await ContactModel.contents.getContent(contactType, user._id, user.avatar, user.username, user.address);
            });
            resolve(await Promise.all(users)); //do hàm map không đợi await thực thi xong mà nó cứ return ra nên dùng Promise.all để đợi tất cả cùng xong.
        } catch (error) {
            reject(error);
        };
    });
};

let readMoreContactsReceived = (currentUserId, skipNumberContact)=>{
    return new Promise (async (resolve, reject)=>{
        try {
            let contactType = "received";
            let contacts = await ContactModel.model.readMoreContactsReceived(currentUserId, skipNumberContact, LIMIT_NUMBER_TAKEN);
            let users = contacts.map( async (contact)=>{ //return về mảng mới
                let user = await UserModel.findCustomDataUser(contact.userId);
                if(user.address == null){user.address = ""};
                return await ContactModel.contents.getContent(contactType, user._id, user.avatar, user.username, user.address);
            });
            resolve(await Promise.all(users)); //do hàm map không đợi await thực thi xong mà nó cứ return ra nên dùng Promise.all để đợi tất cả cùng xong.
        } catch (error) {
            reject(error);
        };
    });
};

let approveRequestContactReceived = (currentUserId, contactId)=>{
    return new Promise(async (resolve, reject)=>{
        let approveReq = await ContactModel.model.approveRequestContactReceived(currentUserId, contactId);
        if(approveReq.nModified === 0){
            return reject(false);
        }
        //create notification
        let notificationItem = {
            senderId: currentUserId,
            receiverId: contactId,
            type: NotificationModel.types.APPROVE_CONTACT,
        }
        await NotificationModel.model.createNew(notificationItem);
        resolve(true);
    }); 
};


module.exports = {
    findUsersContact: findUsersContact,
    addNew: addNew,
    removeRequestContactSent: removeRequestContactSent,
    getContacts: getContacts,
    getContactsSend: getContactsSend,
    getContactsReceived: getContactsReceived,
    countAllContacts: countAllContacts,
    countAllContactsSend: countAllContactsSend,
    countAllContactsReceived: countAllContactsReceived,
    readMoreContacts: readMoreContacts,
    readMoreContactsSend: readMoreContactsSend,
    readMoreContactsReceived: readMoreContactsReceived,
    removeRequestContactReceived: removeRequestContactReceived,
    approveRequestContactReceived: approveRequestContactReceived,
    removeContact: removeContact
}