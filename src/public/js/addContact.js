

function addContact(){
    $(".user-add-new-contact").bind("click", function(){
        let targetId = $(this).data("uid");
         $.post("/contact/add-new", {uid: targetId}, function(data){
            if(data.success){
                $("#find-user").find(`div.user-add-new-contact[data-uid = ${targetId}]`).hide();
                $("#find-user").find(`div.user-remove-request-contact[data-uid = ${targetId}]`).css("display", "inline-block");
                increaseNumberNotifContact("count-request-contact-sent");
                //xử lý realtime
                socket.emit("add-new-contact", {contactId: targetId}); // gửi tên sự kiện truyền tham số
            }
         })
    });
};

//lắng nghe sự kiện server gửi về
socket.on("response-add-new-contact", function(user){ //user is current user from emit addNewContact.js
    let notif = `<span class="notif-readed-false" data-uid="${ user.id }">
                <img class="avatar-small" src ="images/users/${ user.avatar }" alt=""> 
                <strong>${ user.username }</strong> đã gửi cho bạn một lời mời kết bạn!
                </span><br><br><br>`;
    $(".noti_content").prepend(notif); // những thông báo mới nhất sẽ lên đầu
    increaseNumberNotificationContact("count-request-contact-received"); //trong tab quản lý liên lạc
    increaseNumberNotificationContact("noti_contact_counter");
    increaseNumberNotificationContact("noti_counter");

});