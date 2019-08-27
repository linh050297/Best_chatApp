$(document).ready(function(){
    
    //read more contact
    $("#link-read-more-contacts").bind("click",function(){
        let skipNumber = $("#link-read-more-contacts>div>ul.contactList").find("li").length;
        console.log('skipNumber: ', skipNumber);

        $("#link-read-more-contacts").css("display","none");
        $(".lds-facebook").css("display","inline-block");
        

        $.get(`/contact/read-more-contacts?skipNumber=${skipNumber}`,function(contacts){ //query params
            if(!contacts.length){
                alertify.notify("Không còn bạn bè nào nữa!!!","error",7);
                $("#link-read-more-contacts").css("display","block");
                $(".lds-facebook").css("display","none");
            }
            contacts.forEach(function(contact){
                console.log("contact::",contact);
                
                $("#link-read-more-contacts>div>ul.contactList").append(`<li>${contact}</li>`); // thêm vào modal thông báo
            });
            $(".lds-facebook").css("display","none");
                $("#link-read-more-contacts").css("display","block");
        }) //query params
    });

});