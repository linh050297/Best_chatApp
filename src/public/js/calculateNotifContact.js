function increaseNumberNotifContact(className){
    let currentValue = +$(`.${className}`).find("em").text(); //dấu cộng chuyển string thành số còn mặc định sẽ là 0 
    currentValue += 1;

    if(currentValue === 0 ){
        $(`.${className}`).html("");
    }else{
        $(`.${className}`).html(`(<em>${currentValue}</em>)`);
    }
};

function decreaseNumberNotifContact(className){
    let currentValue = +$(`.${className}`).find("em").text(); //dấu cộng chuyển string thành số còn mặc định sẽ là 0 
    currentValue -= 1;
    console.log("currentValue",currentValue);
    if(currentValue === 0 ){
        $(`.${className}`).html("");
        console.log($(`.${className}`).html(""));
    }else{
        $(`.${className}`).html(`(<em>${currentValue}</em>)`);
    }
};