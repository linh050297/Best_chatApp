import { pushSocketIdToArray, emitNotifyToArray, removeSocketIdFromArray } from "./../../helpers/socketHelper"; 

let typingOff = (io)=>{  // io from socket io lib
    let clients = {}; // khởi tạo 1 đối tượng chứa tổng hợp các client
    io.on("connection",(socket)=>{
        // let currentUserId = socket.request.user._id; //userId của người dùng khi khởi tạo socketIo
        clients = pushSocketIdToArray(clients, socket.request.user._id, socket.id);
        socket.request.user.chatGroupIds.forEach(group => {
            clients = pushSocketIdToArray(clients, group._id, socket.id);
        });
        
        socket.on("user-is-not-typing", (data)=>{
            if(data.groupId){ //người dùng là nhóm trò chuyện

                let response = {
                    currentGroupId: data.groupId,
                    currentUserId: socket.request.user._id, // from passport socket 
                };

                if(clients[data.groupId]){ 
                    emitNotifyToArray(clients, data.groupId, io, "response-user-is-not-typing", response);

                }
            }

            if(data.contactId){ //người dùng là 1 người
                let response = {
                    currentUserId: socket.request.user._id // from passport socket 
                };

                //gửi trả thông báo về 1 user được nhận thông báo kết bạn
                if(clients[data.contactId]){ 
                    emitNotifyToArray(clients, data.contactId, io, "response-user-is-not-typing", response);
                }
            }

            
            
        });
        
        //lắng nghe disconnect
        socket.on("disconnect", ()=>{
           clients =  removeSocketIdFromArray(clients, socket.request.user._id, socket);
           socket.request.user.chatGroupIds.forEach(group => {
            clients =  removeSocketIdFromArray(clients, group._id, socket);
        });
        });
    });
}

module.exports = typingOff;