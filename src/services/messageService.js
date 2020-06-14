import ContactModel from "./../models/contact.model";
import UserModel from "./../models/user.model";
import ChatGroupModel from "./../models/chatGroup.model";
import MessageModel from "./../models/message.model";
import { transErrors } from "./../../lang/vi";
import { app } from "./../config/app";
import _ from "lodash";

const LIMIT_CONVERSATIONS_TAKEN = 15;
const LIMIT_MESSAGES_TAKEN = 30;


let getAllConversationItems = (currentUserId)=>{
    return new Promise( async (resolve, reject)=>{
        try {
            let contacts = await ContactModel.model.getContacts(currentUserId, LIMIT_CONVERSATIONS_TAKEN);
            let usersConversationsPromise = contacts.map( async (contact)=>{ //return về mảng mới
                if(contact.contactId == currentUserId){
                    let getUserContact = await UserModel.findUserByIdForSessionToUse(contact.userId);
                    getUserContact.updatedAt = contact.updatedAt; //do contacts và getUserContact cùng từ mongoose xuất ra nên có thể add updatedAt trực tiếp nếu không thì phải chuyển getUserContact thành object bằng lệnh toObject().
                    return getUserContact;
                }else{
                    let getUserContact = await UserModel.findUserByIdForSessionToUse(contact.contactId);
                    getUserContact.updatedAt = contact.updatedAt; //do contacts và getUserContact cùng từ mongoose xuất ra nên có thể add updatedAt trực tiếp nếu không thì phải chuyển getUserContact thành object bằng lệnh toObject().
                    return getUserContact;
                }
            });
            let userConversations = await Promise.all(usersConversationsPromise);
            let groupConversations = await ChatGroupModel.getChatGroups(currentUserId, LIMIT_CONVERSATIONS_TAKEN);
            let allConversations = userConversations.concat(groupConversations);
            
            allConversations = _.sortBy(allConversations, (item)=>{
                return -item.updatedAt; //sắp xếp từ lớn xuống nhỏ
            });
            //get messages to apply screenchat
            let allConversationWithMessagesPromise = allConversations.map(async(conversation) => { //lấy tin nhắn của từng cuộc hội thoại
                conversation = conversation.toObject(); //phải biến đổi conversation thành object để có thể thêm message vào

                if(conversation.members){
                    let getMessages = await MessageModel.model.getMessagesInGroup( conversation._id, LIMIT_MESSAGES_TAKEN);
                    conversation.messages = getMessages;
                }else{
                    let getMessages = await MessageModel.model.getMessagesInPersonal(currentUserId, conversation._id, LIMIT_MESSAGES_TAKEN);
                    conversation.messages = getMessages;
                }
                
                return conversation;
            });
            let allConversationWithMessages = await Promise.all(allConversationWithMessagesPromise);
            // sắp xếp lại thứ tự message
            allConversationWithMessages = _.sortBy(allConversationWithMessages, (item)=>{
                return -item.updatedAt;
            });

            resolve({
                // userConversations: userConversations,
                // groupConversations: groupConversations,
                // allConversations: allConversations,
                allConversationWithMessages: allConversationWithMessages
            });
        } catch (error) {
            reject(error)
        }
    });
};

/**
 * add new message text an emoji
 * @param {object} sender current user
 * @param {string} receiverId id of an user or a group
 * @param {string} messageVal 
 * @param {boolean} isChatGroup 
 */
let addNewTextEmoji = (sender, receiverId, messageVal, isChatGroup)=>{
    return new Promise(async (resolve, reject)=>{
        try {
            
            if(isChatGroup){ //tin nhắn nhóm trò chuyện
                let getChatGroupReceiver = await ChatGroupModel.getChatGroupById(receiverId);
                if(!getChatGroupReceiver){
                    return reject(transErrors.conversation_not_found)
                }
                let receiver = {
                    id : getChatGroupReceiver._id,
                    name : getChatGroupReceiver.name,
                    avatar : app.general_avatar_group_chat
                };

                let newMessageItem = {
                    senderId: sender.id,
                    receiverId: receiver.id,
                    conversationType: MessageModel.conversationTypes.GROUP,
                    messageType: MessageModel.messageType.TEXT,
                    sender: sender,
                    receiver: receiver,
                    text: messageVal,
                    createdAt: Date.now(),
                };

                let newMessage = await MessageModel.model.createNew(newMessageItem);
                await ChatGroupModel.updateWhenHasNewMessage( getChatGroupReceiver._id, getChatGroupReceiver.messageAmount + 1 );
                resolve(newMessage);
            
            }else{ //tin nhắn tới 1 user cụ thể

                let getUserReceiver = await UserModel.getNormalUserById(receiverId);
                if(!getUserReceiver){
                    return reject(transErrors.conversation_not_found);
                };

                let receiver = {
                    id : getUserReceiver._id,
                    name : getUserReceiver.username,
                    avatar : getUserReceiver.avatar
                };

                let newMessageItem = {
                    senderId: sender.id,
                    receiverId: receiver.id,
                    conversationType: MessageModel.conversationTypes.PERSONAL,
                    messageType: MessageModel.messageType.TEXT,
                    sender: sender,
                    receiver: receiver,
                    text: messageVal,
                    createdAt: Date.now(),
                };

                //tạo mới message và update groupchat
                let newMessage = await MessageModel.model.createNew(newMessageItem);
                //update contact
                await ContactModel.updateWhenHasNewMessage( sender.id, getUserReceiver._id );
                resolve(newMessage);
            }

        } catch (error) {
            console.log('error: ', error);
            reject(error);
        }
    })
}


module.exports = { 
    getAllConversationItems: getAllConversationItems ,
    addNewTextEmoji: addNewTextEmoji
}
