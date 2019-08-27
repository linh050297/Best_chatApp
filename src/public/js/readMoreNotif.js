$(document).ready(function(){
    $("#link-read-more-notif").bind("click",function(){
        let skipNumber = $("ul.list-notifications").find("li").length;

        $("#link-read-more-notif").css("display","none");
        $(".lds-facebook").css("display","inline-block");
        

        $.get(`/notification/read-more?skipNumber=${skipNumber}`,function(notifications){ //query param
            if(!notifications.length){
                alertify.notify("Không còn thông báo nào nữa!!!","error",7);
                $("#link-read-more-notif").css("display","block");
                $(".lds-facebook").css("display","none");
            }
            notifications.forEach(function(notification){
                
                $("ul.list-notifications").append(`<li>${notification}</li>`); // thêm vào modal thông báo
            });
            $(".lds-facebook").css("display","none");
                $("#link-read-more-notif").css("display","block");
        }) //query params
    });
});