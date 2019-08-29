//read more contact received
$(document).ready(function(){
$("#link-read-more-contacts-received").bind("click",function(){
    let skipNumber = $("#request-contact-received>div>ul.contactList").find("li").length;

    $("#link-read-more-contacts-received").css("display","none");
    $(".lds-facebook").css("display","inline-block");
    

    $.get(`/contact/read-more-contacts-received?skipNumber=${skipNumber}`,function(contacts){ //query params
        if(!contacts.length){
            alertify.notify("Không còn thông báo nào nữa!!!","error",7);
            $("#link-read-more-contacts-received").css("display","block");
            $(".lds-facebook").css("display","none");
        }
        contacts.forEach(function(contact){
            
            $("#request-contact-received>div>ul.contactList").append(`${contact}`); // thêm vào modal thông báo
        });
        removeRequestContactReceived();
        $(".lds-facebook").css("display","none");
        $("#link-read-more-contacts-received").css("display","block");
    }) //query params
});
});