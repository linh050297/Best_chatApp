import addNewContact from "./contact/addNewContact";
import removeRequestContact from "./contact/removeRequestContact";

let initSockets = (io)=>{ //io from socket io library
    addNewContact(io);
    removeRequestContact(io);
    //
}

module.exports = initSockets;