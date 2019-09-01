
function removeContact (){
    $(".user-remove-contact").unbind("click").on("click", function(){ //vì request gửi 2 lần nên bị 500 error( cần phải unbind sự kiện để request 1 lần )
        let targetId = $(this).data("uid");
        let userName = $(this).parent().find("div.user-name p").text();
        Swal.fire({
            title: `Bạn có chắc muốn xóa ${userName} khỏi danh bạ không?`,
            text: "Thao tác này sẽ không được hoàn tác!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'OK!',
            cancelButtonText: "Hủy"
          }).then((result) => {
              if(!result.value){
                return false;
              }
            if (result.value) {
                $.ajax({
                    url: "/contact/remove-contact",
                    type: "delete",
                    data: {uid: targetId},
                    success: function(data){
                        if(data.success){
                            $("#contacts").find(`ul li[data-uid = ${targetId}]`).remove();
                            decreaseNumberNotifContact("count-contacts"); //giảm tab yêu cầu kết bạn xuống 1 ĐV
                            //chức năng xóa user ở phần chat
        
                            //xử lý realtime
                            socket.emit("remove-contact", {contactId: targetId}); // gửi tên sự kiện truyền tham số
                        }
                    }
                });
            };
          });
    });
};

//lắng nghe sự kiện server gửi về
socket.on("response-remove-contact", function(user){
    $("#contacts").find(`ul li[data-uid = ${user.id}]`).remove();
    decreaseNumberNotifContact("count-contacts"); //giảm tab yêu cầu kết bạn xuống 1 ĐV
    //chức năng xóa user ở phần chat
});

$(document).ready(function(){
    removeContact();
});