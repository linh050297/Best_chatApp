function increaseNumberNotifContact(className){
    let currentValue = +$(`.${className}`).find("b").text(); //dấu cộng chuyển string thành số còn mặc định sẽ là 0 
    currentValue += 1;
    if(currentValue === 0 ){
        $(`.${className}`).html("");
    }else{
        $(`.${className}`).html(`(<b>${currentValue}</b>)`);
    }
};

function decreaseNumberNotifContact(className){
    let currentValue = +$(`.${className}`).find("b").text(); //dấu cộng chuyển string thành số còn mặc định sẽ là 0 
    
    currentValue -= 1;
    if(currentValue === 0 ){
        $(`.${className}`).html("");
    }else{
        $(`.${className}`).html(`(<b>${currentValue}</b>)`);
    }
};