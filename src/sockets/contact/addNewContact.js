let addNewContact = (io)=>{
    io.on("connection",(socket)=>{
        socket.on("add-new-contact", (data)=>{
            console.log(data);
        });
    });
}

module.exports = addNewContact;