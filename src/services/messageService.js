import ContactModel from "./../models/contact.model";
import UserModel from "./../models/user.model";
import ChatGroupModel from "./../models/chatGroup.model";
import _ from "lodash";

const LIMIT_CONVERSATIONS_TAKEN = 15;


let getAllConversationItems = (currentUserId)=>{
    return new Promise( async (resolve, reject)=>{
        try {
            let contacts = await ContactModel.model.getContacts(currentUserId, LIMIT_CONVERSATIONS_TAKEN);
            let usersConversationsPromise = contacts.map( async (contact)=>{ //return về mảng mới
                if(contact.contactId == currentUserId){
                    let getUserContact = await UserModel.findUserById(contact.userId);
                    getUserContact.updatedAt = contact.updatedAt; //do contacts và getUserContact cùng từ mongoose xuất ra nên có thể add updatedAt trực tiếp nếu không thì phải chuyển getUserContact thành object bằng lệnh toObject().
                    return getUserContact;
                }else{
                    let getUserContact = await UserModel.findUserById(contact.contactId);
                    getUserContact.updatedAt = contact.updatedAt; //do contacts và getUserContact cùng từ mongoose xuất ra nên có thể add updatedAt trực tiếp nếu không thì phải chuyển getUserContact thành object bằng lệnh toObject().
                    return getUserContact;
                }
            });
            let userConversations = await Promise.all(usersConversationsPromise);
            let groupConversations = await ChatGroupModel.getChatGroups(currentUserId, LIMIT_CONVERSATIONS_TAKEN);
            let allConversations = userConversations.concat(groupConversations);
            allConversations = _.sortBy(allConversations, (item)=>{
                return -item.updatedAt; //sắp xếp từ lớn xuống nhỏ
            })

            resolve({
                userConversations: userConversations,
                groupConversations: groupConversations,
                allConversations: allConversations
            });
        } catch (error) {
            reject(error)
        }
    });
};


module.exports = { 
    getAllConversationItems: getAllConversationItems 
}
