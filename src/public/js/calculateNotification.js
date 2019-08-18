function increaseNumberNotificationContact(className){
    let currentValue = +$(`.${className}`).text(); //dấu cộng chuyển string thành số còn mặc định sẽ là 0 
    currentValue += 1;

    if(currentValue === 0 ){
        $(`.${className}`).css("display","none").html("");
    }else{
        $(`.${className}`).css("display","inline").html(currentValue);
    }
};

function decreaseNumberNotificationContact(className){
    let currentValue = +$(`.${className}`).text(); //dấu cộng chuyển string thành số còn mặc định sẽ là 0 
    currentValue -= 1;

    if(currentValue <= 0 ){
        $(`.${className}`).css("display","none").html("");
    }else{
        $(`.${className}`).css("display","inline").html(currentValue);
        
    }
};