import addNewContact from "./contact/addNewContact";

let initSockets = (io)=>{ //io from socket io library
    addNewContact(io);
    //
}

module.exports = initSockets;