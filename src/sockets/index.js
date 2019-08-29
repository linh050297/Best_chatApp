import addNewContact from "./contact/addNewContact";
import removeRequestContactSent from "./contact/removeRequestContactSent";
import removeRequestContactReceived from "./contact/removeRequestContactReceived";

let initSockets = (io)=>{ //io from socket io library
    addNewContact(io);
    removeRequestContactSent(io);
    removeRequestContactReceived(io);
    //
}

module.exports = initSockets;