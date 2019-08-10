
let userAvarta = null;
let userInfo = {};
let originAvatarSrc = null;
let originUserInfo = {};

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
        let username = $(this).val();
        let regexUsername = new RegExp("^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$");

        if(!regexUsername.test(username) || username.length < 3 || username.length > 30){
            alertify.notify("Username giới hạn trong khoảng 3-17 ký tự và không có ký tự đặc biệt!", "error", 7);
            $(this).val(originUserInfo.username);
            delete userInfo.username;
            return false;
        } 

        userInfo.username = username;
    });

    $("#input-change-gender-male").bind("click", function(){  
        let gender = $(this).val();

        if(gender !== "male"){
            alertify.notify("Ooop! Bạn là hacker chăng ?", "error", 7);
            $(this).val(originUserInfo.gender);
            delete userInfo.gender;
            return false;
        }

        userInfo.gender = gender;
    });

    $("#input-change-gender-female").bind("click", function(){
        let gender = $(this).val();

        if(gender !== "female"){
            alertify.notify("Ooop! Bạn là hacker chăng ?", "error", 7);
            $(this).val(originUserInfo.gender);
            delete userInfo.gender;
            return false;
        }

        userInfo.gender = gender;
    });

    $("#input-change-address").bind("change", function(){
        let userAddress = $(this).val();

        if(userAddress.length > 30 || userAddress.length < 3){
            alertify.notify("Địa chỉ trong khoảng 3-30 ký tự", "error", 7);
            $(this).val(originUserInfo.address);
            delete userInfo.address;
            return false;
        }

        userInfo.address = userAddress;
    });

    $("#input-change-phone").bind("change", function(){
        let phone = $(this).val();
        let regexPhone = new RegExp("^(0)[0-9]{9,10}$");
        if(!regexPhone.test(phone)){
            alertify.notify("Số điện thoại Việt Nam bắt đầu bằng số 0, giới hạn trong khoảng 10-11 ký tự", "error", 7);
            $(this).val(originUserInfo.phone);
            delete userInfo.phone;
            return false;
        }

        userInfo.phone = phone;
    });
}

function callUpdateUserAvatar(){
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
}

function callUpdateUserInfo(){
    $.ajax({
        url: "/user/update-info",
        type: "put",
        data: userInfo,
        success: function(result){
            console.log(result);
            //display success
            //biến result lấy từ result bên userController.js
            $(".user-modal-alert-success").find("span").text(result.message);
            $(".user-modal-alert-error").css("display", "none");
            $(".user-modal-alert-success").css("display", "block");
            originUserInfo = Object.assign(originUserInfo, userInfo); // cập nhật dữ liệu từ userInfo sang OriginUserInfo

            //update username at navbar
            $("#navbar-username").text(originUserInfo.username);
            //reset all
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
}

$(document).ready(function(){
    originAvatarSrc = $("#user-modal-avatar").attr("src");
    //lấy giá trị của tất cả các trường trước khi thay đổi
    originUserInfo = {
        username: $("#input-change-username").val(),
        gender: ($("#input-change-gender-male").is(":checked")) ? $("#input-change-gender-male").val() : $("#input-change-gender-female").val(),
        address: $("#input-change-address").val(),
        phone: $("#input-change-phone").val()
    };

    updateUserInfo();


    $("#input-btn-update-user").bind("click", function(){
        if($.isEmptyObject(userInfo) && !userAvarta){
            alertify.notify("Bạn phải thay đổi thông tin trước khi cập nhật dữ liệu","error", 7);
            return false;
        };

        if(userAvarta){
            callUpdateUserAvatar();
        }
        if(!$.isEmptyObject(userInfo)){
            callUpdateUserInfo();
        }
        // console.log(userAvarta);
        // console.log("userInfo",userInfo);
    });

    //khi nhấn nút hủy bỏ thì cho 2 đối tượng phía trong về null
    $("#input-btn-cancel-update-user").bind("click", function(){
        userAvarta = null;
        userInfo = {};
        $("#input-change-avatar").val(null);
        $("#user-modal-avatar").attr("src", originAvatarSrc);

        $("#input-change-username").val(originUserInfo.username);
        (originUserInfo.gender === "male") ? $("#input-change-gender-male").click() : $("#input-change-gender-female").click();
        $("#input-change-address").val(originUserInfo.address);
        $("#input-change-phone").val(originUserInfo.phone);
    })
})