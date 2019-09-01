

function approveRequestContactReceived (){
    $(".user-approve-request-contact-received").unbind("click").on("click", function(){ //vì request gửi 2 lần nên bị 500 error( cần phải unbind sự kiện để request 1 lần )
        let targetId = $(this).data("uid");
        $.ajax({
            url: "/contact/approve-request-contact-received",
            type: "put",
            data: {uid: targetId},
            success: function(data){
                if(data.success){

                    let userInfo = $("#request-contact-received").find(`ul li[data-uid=${targetId}]`);
                    $(userInfo).find("div.user-approve-request-contact-received").remove(); //xóa nút ở tab yêu cầu kết bạn
                    $(userInfo).find("div.user-remove-request-contact-received").remove(); //xóa nút ở tab yêu cầu kết bạn
                    $(userInfo).find("div.contactPanel")
                        .append(`
                        <div class="user-talk" data-uid="${targetId}">
                        Trò chuyện
                        </div>
                        <div class="user-remove-contact action-danger" data-uid="${targetId}">
                        Xóa liên hệ
                        </div>`); // thêm 2 nút ở danh bạ 
                    let userInfoHtml = userInfo.get(0).outerHTML; //lấy nguyên thẻ html tại tab yêu cầu kết bạn
                    $("#contacts").find("ul").prepend(userInfoHtml); //thêm vào tab danh bạ
                    $(userInfo).remove(); // xóa tại tab yêu cầu kết bạn
                    decreaseNumberNotifContact("count-request-contact-received"); //giảm tab yêu cầu kết bạn xuống 1 ĐV
                    increaseNumberNotifContact("count-contacts");//tăng danh bạ lên 1 ĐV
                    decreaseNumberNotificationContact("noti_contact_counter", 1); //giảm tab thông báo xuống 1 ĐV
                    removeContact();
                    
                    //xử lý realtime
                    socket.emit("approve-request-contact-received", {contactId: targetId}); // gửi tên sự kiện truyền tham số
                }
            }
        })
    });
};

//lắng nghe sự kiện server gửi về
socket.on("response-approve-request-contact-received", function(user){
    let notif = `<div class="notif-readed-false" data-uid="${ user.id }">
                <img class="avatar-small" src ="${ user.avatar }" alt=""> 
                <strong>${ user.username }</strong>đã chấp nhận lời mời kết bạn của bạn!
                </div>`;
    $(".noti_content").prepend(notif); // những thông báo mới nhất sẽ lên đầu
    $("ul.list-notifications").prepend(`<li>${notif}</li>`); // thêm vào modal thông báo
    decreaseNumberNotificationContact("noti_contact_counter",1); //js/calculateNotification.js
    increaseNumberNotificationContact("noti_counter",1); //js/calculateNotification.js

    decreaseNumberNotifContact("count-request-contact-sent"); //giảm tab đang chờ xác nhận xuống 1 ĐV
    increaseNumberNotifContact("count-contacts");//tăng danh bạ lên 1 ĐV

    $("#request-contact-sent").find(`ul li[data-uid = ${user.id}]`).remove();//xóa thẻ div tại tab đang chờ xác nhận
    $("#find-user").find(`ul li[data-uid = ${user.id}]`).remove();//xóa thẻ div tại tab tìm người dùng
    let userInfoHtml = `
        <li class="_contactList" data-uid="${ user.id }">
        <div class="contactPanel">
            <div class="user-avatar">
                <img src="${ user.avatar }" alt="">
            </div>
            <div class="user-name">
                <p>
                ${ user.username }
                </p>
            </div>
            <br>
            <div class="user-address">
                <span>&nbsp ${ user.address }</span>
            </div>
            <div class="user-talk" data-uid="${ user.id }">
                Trò chuyện
            </div>
            <div class="user-remove-contact action-danger" data-uid="${ user.id }">
                Xóa liên hệ
            </div>
        </div>
    </li>
`;
    $("#contacts").find("ul").prepend(userInfoHtml); //thêm vào tab danh bạ
    removeContact();
});

$(document).ready(function(){
    approveRequestContactReceived();
    
});