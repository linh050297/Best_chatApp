function increaseNumberNotificationContact(className, number){
    let currentValue = +$(`.${className}`).text(); //dấu cộng chuyển string thành số còn mặc định sẽ là 0 
    currentValue += number;

    if(currentValue === 0 ){
        $(`.${className}`).css("display","none").html("");
    }else{
        $(`.${className}`).css("display","inline").html(currentValue);
    }
};

function decreaseNumberNotificationContact(className, number){
    let currentValue = +$(`.${className}`).text(); //dấu cộng chuyển string thành số còn mặc định sẽ là 0 
    currentValue -= number;

    if(currentValue === 0 ){
        $(`.${className}`).css("display","none").html("");
    }else{
        $(`.${className}`).css("display","inline").html(currentValue);
        
    }
};