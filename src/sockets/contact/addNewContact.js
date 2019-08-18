let addNewContact = (io)=>{  // io from socket io lib
    io.on("connection",(socket)=>{
        socket.on("add-new-contact", (data)=>{
            console.log(data);
        });
    });
}

module.exports = addNewContact;