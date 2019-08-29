

function removeRequestContactReceived (){
    $(".user-remove-request-contact-received").unbind("click").on("click", function(){ //vì request gửi 2 lần nên bị 500 error( cần phải unbind sự kiện để request 1 lần )
        let targetId = $(this).data("uid");
        $.ajax({
            url: "/contact/remove-request-contact-received",
            type: "delete",
            data: {uid: targetId},
            success: function(data){
                if(data.success){
                    //3 chức năng xóa ở thông báo
                    // $(".noti_content").find(`div[data-uid = ${user.id}]`).remove(); //xóa ở popup
                    // $("ul.list-notifications").find(`li>div[data-uid = ${user.id}]`).parent().remove(); //xóa trong bảng modal thông báo (parent là xóa cả phần tử cha)
                    // decreaseNumberNotificationContact("noti_counter", 1);
                    decreaseNumberNotificationContact("noti_contact_counter", 1);
                    decreaseNumberNotifContact("count-request-contact-received");
                    //xóa ở modal tab yêu cầu kết bạn
                    $("#request-contact-received").find(`li[data-uid = ${targetId}]`).remove();
                    
                    //xử lý realtime
                    socket.emit("user-remove-request-contact-received", {contactId: targetId}); // gửi tên sự kiện truyền tham số
                }
            }
        })
    });
};

//lắng nghe sự kiện server gửi về
socket.on("response-remove-request-contact-received", function(user){ //user is current user from emit addNewContact.js
    $("#find-user").find(`div.user-remove-request-contact-sent[data-uid = ${user.id}]`).hide();
    $("#find-user").find(`div.user-add-new-contact[data-uid = ${user.id}]`).css("display", "inline-block");
                    
    //xóa ở modal tab đang chờ xác nhận
    $("#request-contact-sent").find(`li[data-uid = ${user.id}]`).remove();

    decreaseNumberNotifContact("count-request-contact-sent"); //trong tab quản lý liên lạc
    decreaseNumberNotificationContact("noti_contact_counter", 1);
    

});

$(document).ready(function(){
    removeRequestContactReceived();
});