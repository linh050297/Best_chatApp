import {contact} from "./../services/index";
import {validationResult} from "express-validator/check";

let findUsersContact = async (req, res) =>{
    let errorArr = [];
    let validationErrors = validationResult(req);

    if(!validationErrors.isEmpty()){
        let errors = Object.values(validationErrors.mapped());
        errors.forEach(item => {
            errorArr.push(item.msg);
        });
        return res.status(500).send(errorArr);
    }
    try {
        let currentUserId = req.user._id;
        let keyword = req.params.keyword;
        let users = await contact.findUsersContact(currentUserId, keyword);
        return res.render("main/contact/sections/_findUserContact", {users});
    } catch (error) {
        return res.status(500).send(error);
    }
}

let addNew = async (req, res) =>{
    
    try {
        let currentUserId = req.user._id;
        let contactId = req.body.uid;

        let newContact = await contact.addNew(currentUserId, contactId);
        // console.log(!!newContact);
        return res.status(200).send({success: !!newContact})

    } catch (error) {
        return res.status(500).send(error);
    }
}

let removeRequestContactSent = async (req, res) =>{
    
    try {
        let currentUserId = req.user._id;
        let contactId = req.body.uid;

        let removeReq = await contact.removeRequestContactSent(currentUserId, contactId);
        // console.log(!!newContact);
        return res.status(200).send({success: !!removeReq})

    } catch (error) {
        return res.status(500).send(error);
    }
};

let removeContact = async (req, res)=>{
    try {
        let currentUserId = req.user._id;
        let contactId = req.body.uid;

        let removeReq = await contact.removeContact(currentUserId, contactId);
        // console.log(!!newContact);
        return res.status(200).send({success: !!removeReq});
    } catch (error) {
        return res.status(500).send(error);
    }
};

let removeRequestContactReceived = async (req, res)=>{
    try {
        let currentUserId = req.user._id;
        let contactId = req.body.uid;

        let removeReq = await contact.removeRequestContactReceived(currentUserId, contactId);
        // console.log(!!newContact);
        return res.status(200).send({success: !!removeReq})
    } catch (error) {
        return res.status(500).send(error);
    }
};

let readMoreContacts = async (req, res)=>{
    try {
        //get skipnumber from query param
        let skipNumberContact = +(req.query.skipNumber)//lấy dữ liệu dựa trên query params bên js/readMoreContact.js
        //get more item contact
        let newContacts = await contact.readMoreContacts(req.user._id, skipNumberContact);
        return res.status(200).send(newContacts);
    } catch (error) {
        return res.status(500).send(error);
    }
};

let readMoreContactsSend = async (req, res)=>{
    try {
        //get skipnumber from query param
        let skipNumberContact = +(req.query.skipNumber)////lấy dữ liệu dựa trên query params bên js/readMoreContact.js
        //get more item contact
        let newContacts = await contact.readMoreContactsSend(req.user._id, skipNumberContact);
        return res.status(200).send(newContacts);
    } catch (error) {
        return res.status(500).send(error);
    }
};

let readMoreContactsReceived = async (req, res)=>{
    try {
        //get skipnumber from query param
        let skipNumberContact = +(req.query.skipNumber)////lấy dữ liệu dựa trên query params bên js/readMoreContact.js
        //get more item contact
        let newContacts = await contact.readMoreContactsReceived(req.user._id, skipNumberContact);
        return res.status(200).send(newContacts);
    } catch (error) {
        res.status(500).send(error);
    }
};

let approveRequestContactReceived = async (req, res)=>{
    try {
        let currentUserId = req.user._id;
        let contactId = req.body.uid;

        let approveReq = await contact.approveRequestContactReceived(currentUserId, contactId);
        // console.log(!!newContact);
        return res.status(200).send({success: !!approveReq})
    } catch (error) {
        return res.status(500).send(error);
    }
};

module.exports = {  findUsersContact: findUsersContact,
                    addNew: addNew, 
                    removeRequestContactSent: removeRequestContactSent,
                    readMoreContacts: readMoreContacts,
                    readMoreContactsSend: readMoreContactsSend,
                    readMoreContactsReceived: readMoreContactsReceived,
                    removeRequestContactReceived: removeRequestContactReceived,
                    approveRequestContactReceived: approveRequestContactReceived,
                    removeContact: removeContact };  