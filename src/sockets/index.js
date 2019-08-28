import addNewContact from "./contact/addNewContact";
import removeRequestContactSent from "./contact/removeRequestContactSent";

let initSockets = (io)=>{ //io from socket io library
    addNewContact(io);
    removeRequestContactSent(io);
    //
}

module.exports = initSockets;