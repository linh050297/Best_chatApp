import { pushSocketIdToArray, emitNotifyToArray, removeSocketIdFromArray } from "./../../helpers/socketHelper"; 

let removeContact = (io)=>{  // io from socket io lib
    let clients = {}; // khởi tạo 1 đối tượng chứa tổng hợp các client
    io.on("connection",(socket)=>{
        // let currentUserId = socket.request.user._id; //userId của người dùng khi khởi tạo socketIo
        clients = pushSocketIdToArray(clients, socket.request.user._id, socket.id);
        // console.log("clients",clients);
        socket.on("remove-contact", (data)=>{
            // console.log(data);
            // console.log(socket.request.user);
            let currentUser = {
                id: socket.request.user._id, // from passport socket 
            };

            //gửi trả thông báo về 1 user được nhận thông báo kết bạn
            if(clients[data.contactId]){ //contactId nhận được khi emit sự kiện add-new-contact từ addContact
                emitNotifyToArray(clients, data.contactId, io, "response-remove-contact", currentUser);
            }
            
        });
        
        //lắng nghe disconnect
        socket.on("disconnect", ()=>{
           clients =  removeSocketIdFromArray(clients, socket.request.user._id, socket);
        });
    });
}

module.exports = removeContact;