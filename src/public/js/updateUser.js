
let userAvarta = null;
let userInfo = {};
let originAvatarSrc = null;
let originUserInfo = {};
let userUpdatePassword = {};

function callLogout(){
    let timerInterval;
    Swal.fire({
        position: 'top-end',
        title: 'Đang thực hiện đăng xuất...',
        html:"Tự động đăng xuất sau: <strong></strong>",
        timer: 4000,
        onBeforeOpen:()=>{
            Swal.showLoading();
            timerInterval = setInterval(()=>{
                Swal.getContent().querySelector("strong").textContent = Math.ceil(Swal.getTimerLeft() / 1000)
            }, 1000)
        },
        onClose: ()=>{
            clearInterval(timerInterval);
        }
      }).then((result)=>{
        $.get("/logout", function(){ //gọi đến router logout
            location.reload();
        });
      });
};

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
        let regexUsername = new RegExp(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/);

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
        let regexPhone = new RegExp(/^(0)[0-9]{9,10}$/);
        if(!regexPhone.test(phone)){
            alertify.notify("Số điện thoại Việt Nam bắt đầu bằng số 0, giới hạn trong khoảng 10-11 ký tự", "error", 7);
            $(this).val(originUserInfo.phone);
            delete userInfo.phone;
            return false;
        }

        userInfo.phone = phone;
    });
    //current password
    $("#input-change-current-password").bind("change", function(){
        let currentPassword = $(this).val();
        let regexCurrentPassword = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/);
        if(!regexCurrentPassword.test(currentPassword)){
            alertify.notify("Mật khẩu phải chứa ít nhất 8 ký tự ( chữ hoa, chữ thường, chữ số, ký tự đặc biệt )", "error", 7);
            $(this).val(null);
            delete userUpdatePassword.currentPassword;
            return false;
        }

        userUpdatePassword.currentPassword = currentPassword;
    });
    //password
    $("#input-change-new-password").bind("change", function(){
        let newPassword = $(this).val();
        let regexNewPassword = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/);
        if(!regexNewPassword.test(newPassword)){
            alertify.notify("Mật khẩu phải chứa ít nhất 8 ký tự ( chữ hoa, chữ thường, chữ số, ký tự đặc biệt )", "error", 7);
            $(this).val(null);
            delete userUpdatePassword.newPassword;
            return false;
        }
        if(newPassword == userUpdatePassword.currentPassword){
            alertify.notify("Mật khẩu mới không được trùng với mật khẩu cũ", "error", 7);
            $(this).val(null);
            delete userUpdatePassword.newPassword;
            return false;
        }

        userUpdatePassword.newPassword = newPassword;
    });
    //confirm new password
    $("#input-change-confirm-new-password").bind("change", function(){
        let confirmNewPassword = $(this).val();
        if(!userUpdatePassword.newPassword){
            alertify.notify("Bạn chưa nhập mật khẩu mới", "error", 7);
            $(this).val(null);
            delete userUpdatePassword.confirmNewPassword;
            return false;
        }
        if(userUpdatePassword.newPassword !== confirmNewPassword){
            alertify.notify("Không trùng với mật khẩu bạn vừa tạo ở trên", "error", 7);
            $(this).val(null);
            delete userUpdatePassword.confirmNewPassword;
            return false;
        }
        
        userUpdatePassword.confirmNewPassword = confirmNewPassword;
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

function callUpdateUserPassword(){
    $.ajax({
        url: "/user/update-password",
        type: "put",
        data: userUpdatePassword,
        success: async function(result){
            console.log(result);
            //display success
            //biến result lấy từ result bên userController.js
            // $(".user-modal-password-alert-success").find("span").text(result.message);
            // console.log('result.message',result.message);
            // $(".user-modal-password-alert-error").css("display", "none");
            // $(".user-modal-password-alert-success").css("display", "block");
            await Swal.fire({
                position: 'center',
                type: 'success',
                title: result.message,
                showConfirmButton: false,
                timer: 1000,
              });

            //reset all
            $("#input-btn-cancel-update-user-password").click();
            //logout after change password success
           await callLogout();
        },
        error: function(error){
            //display error
            // console.log(error);
            // $(".user-modal-password-alert-error").find("span").text(error.responseText);
            // $(".user-modal-password-alert-success").css("display", "none");
            // $(".user-modal-password-alert-error").css("display", "block");
            Swal.fire({
                position: 'center',
                type: 'error',
                title: `${error.responseText}, Vui lòng thử lại`,
                showConfirmButton: true,
                timer: 2000,
                
              })
            // reset all
            $("#input-btn-cancel-update-user-password").click();
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
    });

    $("#input-btn-update-user-password").bind("click", function(){
        if( !userUpdatePassword.currentPassword || !userUpdatePassword.newPassword || !userUpdatePassword.confirmNewPassword ){
            alertify.notify("Bạn phải nhập đầy đủ thông tin", "error", 7);
            return false;
        }
        Swal.fire({
            title: 'Bạn có chắc muốn cập nhật mật khẩu không?',
            text: "Thao tác này sẽ không được hoàn tác!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'OK!',
            cancelButtonText: "Hủy"
          }).then((result) => {
              if(!result.value){
                $("#input-btn-cancel-update-user-password").click();
                return false;
              }
            if (result.value) {
            //   Swal.fire(
            //     'Thành Công!',
            //     'Mật khẩu của bạn đã được thay đổi',
            //     'success'
            //   );
              callUpdateUserPassword(); //gọi ajax cập nhật mật khẩu
            }
          })
        
    });

    $("#input-btn-cancel-update-user-password").bind("click", function(){
        userUpdatePassword ={};
        $("#input-change-confirm-new-password").val(null);
        $("#input-change-new-password").val(null);
        $("#input-change-current-password").val(null);
    });
});