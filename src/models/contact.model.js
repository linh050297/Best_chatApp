import mongoose from "mongoose";

let Schema = mongoose.Schema;

let ContactSchema = new Schema({
    userId: String,
    contactId: String,
    status: { type: Boolean, default: false },
    createdAt: { type: Number, default: Date.now },
    updatedAt: { type: Number, default: null },
    deletedAt: { type: Number, default: null }
});

ContactSchema.statics = {
    createNew(item){
        return this.create(item);
    },

    findAllByUser(userId){
        return this.find({
            $or: [
                {"userId": userId},
                {"contactId": userId}
            ]
        }).exec();
    },

    checkExists(userId, contactId){
        return this.findOne({
            $or: [
                {$and: [
                    {"userId": userId},
                    {"contactId": contactId}
                ]},
                {$and: [
                    {"contactId": userId},
                    {"userId": contactId}
                ]}
            ]
        }).exec();
    },

    removeRequestContactSent(userId, contactId){
        return this.deleteOne({
            $and: [
                {"userId": userId},
                {"contactId": contactId},
                {"status": false}
            ]
        }).exec();
    },

    removeRequestContactReceived(userId, contactId){
        return this.deleteOne({
            $and: [
                {"contactId": userId},
                {"userId": contactId},
                {"status": false}
            ]
        }).exec();
    },

    removeContact(userId, contactId){
        return this.deleteOne({
            $or: [
                {$and: [
                    {"userId": userId},
                    {"contactId": contactId},
                    {"status": true}
                ]},
                {$and: [
                    {"contactId": userId},
                    {"userId": contactId},
                    {"status": true}
                ]}
            ]
        }).exec();
    },

    getContacts(userId, limit){
        return this.find({
            $and: [
                {$or: [
                    {"userId": userId},
                    {"contactId": userId}
                ]},
                {"status": true}
            ]
        }).sort({"updatedAt" : -1}).limit(limit).exec();
    },

    getContactsSend(userId, limit){
        return this.find({
            $and: [
                {"userId": userId},
                {"status": false}
            ]
        }).sort({"createAt" : -1}).limit(limit).exec();
    },

    getContactsReceived(userId, limit){
        return this.find({
            $and: [
                {"contactId": userId},
                {"status": false}
            ]
        }).sort({"createAt" : -1}).limit(limit).exec();
    },

    //count all
    countAllContacts(userId){
        return this.countDocuments({
            $and: [
                {$or: [
                    {"userId": userId},
                    {"contactId": userId}
                ]},
                {"status": true}
            ]
        }).exec();
    },

    countAllContactsSend(userId){
        return this.countDocuments({
            $and: [
                {"userId": userId},
                {"status": false}
            ]
        }).exec();
    },

    countAllContactsReceived(userId){
        return this.countDocuments({
            $and: [
                {"contactId": userId},
                {"status": false}
            ]
        }).exec();
    },

    readMoreContacts(userId, skip, limit){
        return this.find({
            $and: [
                {$or: [
                    {"userId": userId},
                    {"contactId": userId}
                ]},
                {"status": true}
            ]
        }).sort({"updatedAt" : -1}).skip(skip).limit(limit).exec();
    },

    readMoreContactsSend(userId, skip, limit){
        return this.find({
            $and: [
                {"userId": userId},
                {"status": false}
            ]
        }).sort({"createAt" : -1}).skip(skip).limit(limit).exec();
    },

    readMoreContactsReceived(userId, skip, limit){
        return this.find({
            $and: [
                {"contactId": userId},
                {"status": false}
            ]
        }).sort({"createAt" : -1}).skip(skip).limit(limit).exec();
    },

    approveRequestContactReceived(userId, contactId){
        return this.update({
            $and: [
                {"contactId": userId},
                {"userId": contactId},
                {"status": false}
            ]
        },{
            "status": true,
            "updatedAt": Date.now()
        }).exec();
    },

    /**
     * update contact (chat personal) when has new message
     * @param {string} userId current userId
     * @param {string} contactId contactId
     */
    updateWhenHasNewMessage(userId, contactId){ 
        return this.update({
            $or: [
                {$and: [
                    {"userId": userId},
                    {"contactId": contactId}
                ]},
                {$and: [
                    {"contactId": userId},
                    {"userId": contactId}
                ]}
            ]
        }, {
            "updatedAt": Date.now()
        }).exec();
    },

};

const CONTACT_TYPES = {
    CONTACTS: "contact",
    SENT:"sent",
    RECEIVED:"received"
}

const CONTACT_CONTENT = {
    getContent: (contactType, userId, userAvatar, userName, userAddress)=>{
        if(contactType === CONTACT_TYPES.CONTACTS ){
            return `<li class="_contactList" data-uid="${userId}">
                        <div class="contactPanel">
                            <div class="user-avatar">
                                <img src="${userAvatar}" alt="">
                            </div>
                            <div class="user-name">
                                <p>
                                ${userName}
                                </p>
                            </div>
                            <br>
                            <div class="user-address">
                                <span>&nbsp ${userAddress}</span>
                            </div>
                            <div class="user-talk" data-uid="${userId}">
                                Trò chuyện
                            </div>
                            <div class="user-remove-contact action-danger display-important" data-uid="${userId}">
                                Xóa liên hệ
                            </div>
                        </div>
                    </li>`
        };

        if(contactType === CONTACT_TYPES.SENT){
            return `<li class="_contactList" data-uid="${userId}">
                        <div class="contactPanel">
                            <div class="user-avatar">
                                <img src="${userAvatar}" alt="">
                            </div>
                            <div class="user-name">
                                <p>
                                ${userName}
                                </p>
                            </div>
                            <br>
                            <div class="user-address">
                                <span>&nbsp ${userAddress}</span>
                            </div>
                            <div class="user-remove-request-contact-sent action-danger display-important" data-uid="${userId}">
                                Hủy yêu cầu
                            </div>
                        </div>
                    </li>`
        };

        if(contactType === CONTACT_TYPES.RECEIVED){
            return `<li class="_contactList" data-uid="${userId}">
                        <div class="contactPanel">
                            <div class="user-avatar">
                                <img src="${userAvatar}" alt="">
                            </div>
                            <div class="user-name">
                                <p>
                                ${userName}
                                </p>
                            </div>
                            <br>
                            <div class="user-address">
                                <span>&nbsp ${userAddress}</span>
                            </div>
                            <div class="user-approve-request-contact-received" data-uid="${userId}">
                                Chấp nhận
                            </div>
                            <div class="user-remove-request-contact-received action-danger " data-uid="${userId}">
                                Xóa yêu cầu
                            </div>
                        </div>
                    </li>`
        }
        
    }
}

module.exports ={
    model: mongoose.model("contact", ContactSchema),
    types: CONTACT_TYPES,
    contents: CONTACT_CONTENT
};