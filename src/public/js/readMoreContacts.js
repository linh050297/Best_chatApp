$(document).ready(function(){
    
    //read more contact
    $("#link-read-more-contacts").bind("click",function(){
        let skipNumber = $("#contacts>div>ul.contactList").find("li").length;

        $("#link-read-more-contacts").css("display","none");
        $(".lds-facebook").css("display","inline-block");
        

        $.get(`/contact/read-more-contacts?skipNumber=${skipNumber}`,function(contacts){ //query params
            if(!contacts.length){
                alertify.notify("Không còn bạn bè nào nữa!!!","error",7);
                $("#link-read-more-contacts").css("display","block");
                $(".lds-facebook").css("display","none");
            }
            contacts.forEach(function(contact){
                
                $("#contacts>div>ul.contactList").append(`${contact}`); // thêm vào modal thông báo
            });
            removeContact();
            $(".lds-facebook").css("display","none");
            $("#link-read-more-contacts").css("display","block");
        }); //query params
    });

});