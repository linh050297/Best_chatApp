let userAvarta = null;
let userInfo = {};
let originAvatarSrc = null;

function updateUserInfo(){
    $("#input-change-avatar").bind("change", function(){
        let fileData = $(this).prop("files")[0];
        let math = ["image/png", "image/jpg", "image/jpeg"];
        let limit = 1048576; //byte = 1MB

        if( $.inArray(fileData.type, math) === -1 ){
            alertify.notify("Kiểu file không hợp lệ, chỉ chấp nhận ( jpg, png, jpeg )", "error", 7);
            $(this).val(null);
            return false;
        }
        if( fileData.size > limit ){
            alertify.notify("Kích thước hình quá lớn vui lòng chọn hình khác dưới 1MB", "error", 7);
            $(this).val(null);
            return false;
        }
        
        if(typeof (FileReader) != "undefined"){
            let imagePreview = $("#image-edit-profile");    
            imagePreview.empty();
            let fileReader = new FileReader();
            fileReader.onload = function(element){
                $("<img>", {
                    "src": element.target.result,
                    "class": "avatar img-circle",
                    "id": "user-modal-avatar",
                    "alt": "avatar"
                }).appendTo(imagePreview);
            }
            imagePreview.show();
            fileReader.readAsDataURL(fileData);
            
            let formData = new FormData();
            formData.append("avatar",fileData);
            userAvarta = formData;

        } else {
            alertify.notify("Trình duyệt của bạn không hỗ trợ FileReader", "error", 7);
        }
    });

    $("#input-change-username").bind("change", function(){
        userInfo.username = $(this).val();
    });

    $("#input-change-gender-male").bind("click", function(){
        userInfo.gender = $(this).val();
    });

    $("#input-change-gender-female").bind("click", function(){
        userInfo.gender = $(this).val();
    });

    $("#input-change-address").bind("change", function(){
        userInfo.address = $(this).val();
    });

    $("#input-change-phone").bind("change", function(){
        userInfo.phone = $(this).val();
    });
}

$(document).ready(function(){
    updateUserInfo();

    originAvatarSrc = $("#user-modal-avatar").attr("src");

    $("#input-btn-update-user").bind("click", function(){
        if($.isEmptyObject(userInfo) && !userAvarta){
            alertify.notify("Bạn phải thay đổi thông tin trước khi cập nhật dữ liệu","error", 7);
            return false;
        }
        $.ajax({
            url: "/user/update-avatar",
            type: "put",
            cache: false,
            contentType: false,
            processData: false,
            data: userAvarta,
            success: function(result){
                console.log(result);
                //display success
                //biến result lấy từ result bên userController.js
                $(".user-modal-alert-success").find("span").text(result.message);
                $(".user-modal-alert-error").css("display", "none");
                $(".user-modal-alert-success").css("display", "block");
                //update avatar at navbar
                $("#navbar-avatar").attr("src", result.imageSrc);
                //update originAvatarSrc
                originAvatarSrc = result.imageSrc;
                //reset
                $("#input-btn-cancel-update-user").click();
            },
            error: function(error){
                //display error
                console.log(error);
                $(".user-modal-alert-error").find("span").text(error.responseText);
                $(".user-modal-alert-success").css("display", "none");
                $(".user-modal-alert-error").css("display", "block");
                // reset all
                $("#input-btn-cancel-update-user").click();
            }
        });
        // console.log(userAvarta);
        // console.log("userInfo",userInfo);
    });

    //khi nhấn nút hủy bỏ thì cho 2 đối tượng phía trong về null
    $("#input-btn-cancel-update-user").bind("click", function(){
        userAvarta = null;
        userInfo = {};
        $("#input-change-avatar").val(null);
        $("#user-modal-avatar").attr("src", originAvatarSrc);
    })
})