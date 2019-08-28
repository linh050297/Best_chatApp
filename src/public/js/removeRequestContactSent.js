

function removeRequestContactSent (){
    $(".user-remove-request-contact-sent").unbind("click").on("click", function(){ //vì request gửi 2 lần nên bị 500 error( cần phải unbind sự kiện để request 1 lần )
        let targetId = $(this).data("uid");
        $.ajax({
            url: "/contact/remove-request-contact-sent",
            type: "delete",
            data: {uid: targetId},
            success: function(data){
                if(data.success){
                    $("#find-user").find(`div.user-remove-request-contact-sent[data-uid = ${targetId}]`).hide();
                    $("#find-user").find(`div.user-add-new-contact[data-uid = ${targetId}]`).css("display", "inline-block");
                    
                    decreaseNumberNotifContact("count-request-contact-sent");
                    //xóa ở modal tab yêu cầu xác nhận
                    $("#request-contact-sent").find(`li[data-uid = ${targetId}]`).remove();
                    
                    //xử lý realtime
                    socket.emit("remove-request-contact-sent", {contactId: targetId}); // gửi tên sự kiện truyền tham số
                }
            }
        })
    });
};

//lắng nghe sự kiện server gửi về
socket.on("response-remove-request-contact-sent", function(user){ //user is current user from emit addNewContact.js
    $(".noti_content").find(`div[data-uid = ${user.id}]`).remove(); //xóa ở popup
    $("ul.list-notifications").find(`li>div[data-uid = ${user.id}]`).parent().remove(); //xóa trong bảng modal thông báo (parent là xóa cả phần tử cha)
    //xóa ở modal tab yêu cầu kết bạn
    $("#request-contact-received").find(`li[data-uid = ${user.id}]`).remove();

    decreaseNumberNotifContact("count-request-contact-received"); //trong tab quản lý liên lạc
    decreaseNumberNotificationContact("noti_contact_counter", 1);
    decreaseNumberNotificationContact("noti_counter", 1);

});

$(document).ready(function(){
    removeRequestContactSent();
});