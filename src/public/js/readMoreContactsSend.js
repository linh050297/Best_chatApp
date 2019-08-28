//read more contact send
$(document).ready(function(){
$("#link-read-more-contacts-send").bind("click",function(){
    let skipNumber = $("#request-contact-sent>div>ul.contactList").find("li").length;

    $("#link-read-more-contacts-send").css("display","none");
    $(".lds-facebook").css("display","inline-block");
    

    $.get(`/contact/read-more-contacts-send?skipNumber=${skipNumber}`,function(contacts){ //query params
        if(!contacts.length){
            alertify.notify("Không còn thông báo nào nữa!!!","error",7);
            $("#link-read-more-contacts-send").css("display","block");
            $(".lds-facebook").css("display","none");
        }
        contacts.forEach(function(contact){
            
            $("#request-contact-sent>div>ul.contactList").append(`${contact}`); // thêm vào modal thông báo
        });
        removeRequestContactSent();
        $(".lds-facebook").css("display","none");
        $("#link-read-more-contacts-send").css("display","block");
    }) //query params
});
});