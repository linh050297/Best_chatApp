import ContactModel from "./../models/contact.model";
import UserModel from "./../models/user.model";
import NotificationModel from "./../models/notifications.model";
import _ from "lodash";
const LIMIT_NUMBER_TAKEN = 10;

let findUsersContact = (currentUserId, keyword)=>{
    return new Promise(async (resolve, reject)=>{
        let deprecatedUserIds = [currentUserId];
        let contactsByUser = await ContactModel.findAllByUser(currentUserId);
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
        let contactExists = await ContactModel.checkExists(currentUserId, contactId);
        if(contactExists){
            return reject(false);
        }
        //create contact
        let newContactItem = {
            userId: currentUserId,
            contactId: contactId
        };
        let newContact = await ContactModel.createNew(newContactItem);
        //create notification
        let notificationItem = {
            senderId: currentUserId,
            receiverId: contactId,
            type: NotificationModel.types.ADD_CONTACT,
        }
        await NotificationModel.model.createNew(notificationItem);
        resolve(newContact);
    });
}

let removeRequestContact = (currentUserId, contactId)=>{
    return new Promise(async (resolve, reject)=>{
        let removeReq = await ContactModel.removeRequestContact(currentUserId, contactId);
        if(removeReq.n === 0){
            return reject(false);
        }
        //remove notification
        await NotificationModel.model.removeRequestContactNotification(currentUserId, contactId, NotificationModel.types.ADD_CONTACT);
        resolve(true);
    });
}

let getContacts = (currentUserId)=>{
    return new Promise(async (resolve, reject)=>{
        try {
            let contacts = await ContactModel.getContacts(currentUserId, LIMIT_NUMBER_TAKEN);
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
        }
    });
}

let getContactsSend = (currentUserId)=>{
    return new Promise(async (resolve, reject)=>{
        try {
            let contacts = await ContactModel.getContactsSend(currentUserId, LIMIT_NUMBER_TAKEN);
            let users = contacts.map( async (contact)=>{ //return về mảng mới
                return await UserModel.findUserById(contact.contactId);
            });
            resolve(await Promise.all(users)); //do hàm map không đợi await thực thi xong mà nó cứ return ra nên dùng Promise.all để đợi tất cả cùng xong.
        } catch (error) {
            reject(error)
        }
    });
}

let getContactsReceived = (currentUserId)=>{
    return new Promise(async (resolve, reject)=>{
        try {
            let contacts = await ContactModel.getContactsReceived(currentUserId, LIMIT_NUMBER_TAKEN);
            let users = contacts.map( async (contact)=>{ //return về mảng mới
                return await UserModel.findUserById(contact.userId);
            });
            resolve(await Promise.all(users)); //do hàm map không đợi await thực thi xong mà nó cứ return ra nên dùng Promise.all để đợi tất cả cùng xong.
        } catch (error) {
            reject(error)
        }
    });
}

let countAllContacts = (currentUserId)=>{
    return new Promise ( async (resolve, rejects)=>{
        try {
            let numberOfContacts = await ContactModel.countAllContacts(currentUserId);
            resolve(numberOfContacts);
        } catch (error) {
            rejects(error);
        }
    })
};

let countAllContactsSend = (currentUserId)=>{
    return new Promise ( async (resolve, rejects)=>{
        try {
            let numberOfContacts = await ContactModel.countAllContactsSend(currentUserId);
            resolve(numberOfContacts);
        } catch (error) {
            rejects(error);
        }
    })
};

let countAllContactsReceived = (currentUserId)=>{
    return new Promise ( async (resolve, rejects)=>{
        try {
            let numberOfContacts = await ContactModel.countAllContactsReceived(currentUserId);
            resolve(numberOfContacts);
        } catch (error) {
            rejects(error);
        }
    })
};


module.exports = {
    findUsersContact: findUsersContact,
    addNew: addNew,
    removeRequestContact: removeRequestContact,
    getContacts: getContacts,
    getContactsSend: getContactsSend,
    getContactsReceived: getContactsReceived,
    countAllContacts: countAllContacts,
    countAllContactsSend: countAllContactsSend,
    countAllContactsReceived: countAllContactsReceived
}