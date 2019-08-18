

function removeRequestContact (){
    $(".user-remove-request-contact").bind("click", function(){
        let targetId = $(this).data("uid");
        $.ajax({
            url: "/contact/remove-request-contact",
            type: "delete",
            data: {uid: targetId},
            success: function(data){
                if(data.success){
                    $("#find-user").find(`div.user-remove-request-contact[data-uid = ${targetId}]`).hide();
                    $("#find-user").find(`div.user-add-new-contact[data-uid = ${targetId}]`).css("display", "inline-block");
                    decreaseNumberNotifContact("count-request-contact-sent");
                    //xử lý realtime
                    socket.emit("remove-request-contact", {contactId: targetId}); // gửi tên sự kiện truyền tham số
                }
            }
        })
    });
};

//lắng nghe sự kiện server gửi về
socket.on("response-remove-request-contact", function(user){ //user is current user from emit addNewContact.js
    $(".noti_content").find(`span[data-uid = ${user.id}]`).remove();

    //xóa ở modal tab yêu cầu kết bạn

    decreaseNumberNotifContact("count-request-contact-received"); //trong tab quản lý liên lạc
    decreaseNumberNotificationContact("noti_contact_counter");
    decreaseNumberNotificationContact("noti_counter");

});