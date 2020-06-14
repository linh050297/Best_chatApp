export let pushSocketIdToArray = (clients, userId, socketId)=>{
    if(clients[userId]){
        clients[userId].push(socketId); //khi mảng của 1 người dùng đã có socket.id thì thêm vào mảng đó
    }else{
        clients[userId] = [socketId]; // khi mảng của 1 người dùng chỉ mới bắt đầu khởi tạo
    }
    return clients;
};

export let emitNotifyToArray = (clients, userId, io, eventName, data)=>{
    //gửi trả thông báo về 1 user được nhận thông báo kết bạn
    clients[userId].forEach(socketId => {
        return  io.sockets.connected[socketId].emit(eventName, data); // khi người dùng online thì mới gửi
    });
};

export let removeSocketIdFromArray = (clients, userId, socket)=>{
    clients[userId] = clients[userId].filter((socketId)=>{
        return socketId !== socket.id; //Giữ lại những socketId khác với socketid hiện tại
    });

    if(!clients[userId].length){
        delete clients[userId];
    };
    return clients;
};