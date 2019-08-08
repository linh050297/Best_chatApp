export const transValidation = {
    email_incorrect: "Email phải có dạng ví dụ: linh050297@gmail.com",
    gender_incorrect: "Ủa bạn bị bê đê à ?",
    password_incorrect: "Mật khẩu phải chứa ít nhất 8 ký tự ( chữ hoa, chữ thường, chữ số, ký tự đặc biệt )",
    password_confirmation_incorrect: "Nhập lại mật khẩu chưa chính xác!!!",
    
};

export const transErrors = {
    account_in_use: "Email đã đã được sử dụng, vui lòng tạo tài khoản với email khác !",
    account_removed: "Tài khoản đã bị xóa!",
    account_not_active: "Tài khoản chưa được xác thực",
    token_undefined: "Mã xác nhận Token đã hết hạn hoặc không tồn tại!",
    login_failed: "Sai tài khoản hoặc mật khẩu.",
    server_error: "Có lỗi ở phía server!"
};

export const transSuccess = {
    userCreated: (userEmail) =>{
        return `Tài khoản <strong>${userEmail}</strong> đã được tạo thành công vui lòng kiểm tra email để xác thực tài khoản.`
    },

    emailSended: (userEmail) =>{
        return `Đã gửi email xác thực tài khoản tới <strong>${userEmail}</strong> thành công. Vui lòng kiểm tra email để kích hoạt tài khoản.`
    },

    account_active: `Kích hoạt tài khoản thành công bạn đã có thể đăng nhập rồi đó!`,
    loginSuccess: (username)=>{
        return `Xin chào ${username}, bạn đã đăng nhập thành công <strong>^-^</strong>, have a nice day!`
    },
    logout_success: "Bạn đã đăng xuất thành công"  
}

export const transMail = {
    subject: "Email xác thực tài khoản của phần mềm anh Lĩnh",
    template: (linkVerify)=>{
        return `
        <h2>Bạn vui lòng xác thực tài khoản đã đăng ký trên phần mềm Chat App của anh Lĩnh</h2>
        <h3>Vui lòng click vào liên kết bên dưới để xác nhận tài khoản</h3>
        <h3><a href="${linkVerify}" target="blank">${linkVerify}</a></h3>
        <h4>Cảm ơn bạn đã sử dụng phần mềm</h4>
        `
    },
    send_failed: "Gửi email xác thực không thành công, vui lòng kiểm tra lại email hoặc chọn một email khác!"

}