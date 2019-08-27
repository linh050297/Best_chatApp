

function addContact(){
    $(".user-add-new-contact").bind("click", function(){
        let targetId = $(this).data("uid");
         $.post("/contact/add-new", {uid: targetId}, function(data){
            if(data.success){
                $("#find-user").find(`div.user-add-new-contact[data-uid = ${targetId}]`).hide();
                $("#find-user").find(`div.user-remove-request-contact[data-uid = ${targetId}]`).css("display", "inline-block");
                
                let userInfoHtml = $("#find-user").find(`ul li[data-uid = ${targetId}]`).get(0).outerHTML; //get HTML 
                //thêm ở modal tab đang chờ xác nhận
                $("#request-contact-sent").find("ul").prepend(userInfoHtml);

                increaseNumberNotifContact("count-request-contact-sent");
                //xử lý realtime
                socket.emit("add-new-contact", {contactId: targetId}); // gửi tên sự kiện truyền tham số
            }
         })
    });
};

//lắng nghe sự kiện server gửi về
socket.on("response-add-new-contact", function(user){ //user is current user from emit addNewContact.js
    let notif = `<div class="notif-readed-false" data-uid="${ user.id }">
                <img class="avatar-small" src ="${ user.avatar }" alt=""> 
                <strong>${ user.username }</strong> đã gửi cho bạn một lời mời kết bạn!
                </div>`;
    $(".noti_content").prepend(notif); // những thông báo mới nhất sẽ lên đầu
    $("ul.list-notifications").prepend(`<li>${notif}</li>`); // thêm vào modal thông báo
    increaseNumberNotificationContact("count-request-contact-received"); //trong tab quản lý liên lạc
    increaseNumberNotificationContact("noti_contact_counter",1);
    increaseNumberNotificationContact("noti_counter",1);

    let userInfoHtml = `<li class="_contactList" data-uid="${user.id}">
                            <div class="contactPanel">
                                <div class="user-avatar">
                                    <img src="${user.avatar}" alt="">
                                </div>
                                <div class="user-name">
                                    <p>
                                    ${ user.username }
                                    </p>
                                </div>
                                <br>
                                <div class="user-address">
                                    <span>&nbsp ${user.address}</span>
                                </div>
                                <div class="user-acccept-contact-received" data-uid="${user.id}">
                                    Chấp nhận
                                </div>
                                <div class="user-reject-request-contact-received action-danger" data-uid="${user.id}">
                                    Xóa yêu cầu
                                </div>
                            </div>
                        </li>`
    //thêm ở modal yêu cầu kết bạn
    $("#request-contact-received").find("ul").prepend(userInfoHtml);             
});