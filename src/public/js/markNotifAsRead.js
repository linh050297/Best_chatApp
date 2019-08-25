function markNotificationAsRead (targetUsers){
    $.ajax({
        url: "/notification/mark-all-as-read",
        type: "put",
        data: {targetUsers: targetUsers},
        success: function(result){
            if(result){
                targetUsers.forEach(function(uid){
                    $(".noti_content").find(`div[data-uid = ${uid}]`).removeClass("notif-readed-false");
                    $("ul.list-notifications").find(`li>div[data-uid = ${uid}]`).removeClass("notif-readed-false");
                });
                decreaseNumberNotificationContact("noti_counter", targetUsers.length);
            }
        }
    });
};

$(document).ready(function(){
    //link at popup notifications
    $("#popup-mark-notif-as-read").bind("click",function(){
        let targetUsers = [];
        $(".noti_content").find("div.notif-readed-false").each(function(index, notification){ //each là của jquery
            targetUsers.push($(notification).data("uid"));
        });
        if(!targetUsers.length){
            alertify.notify("Bạn không còn thông báo nào chưa đọc", "error",7);
            return false;
        };

        markNotificationAsRead(targetUsers);
    });
    //at modal nitifications
    $("#modal-mark-notif-as-read").bind("click",function(){
        let targetUsers = [];
        $("ul.list-notifications").find("li>div.notif-readed-false").each(function(index, notification){
            targetUsers.push($(notification).data("uid"));
        });
        if(!targetUsers.length){
            alertify.notify("Bạn không còn thông báo nào chưa đọc", "error",7);
            return false;
        }
        markNotificationAsRead(targetUsers);
    });
});