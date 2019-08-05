let sum = (a, b , callback) => {
    setTimeout(()=>{
        let err , result;
        if(typeof a != "number" || typeof b != "number"){
            err ="giá trị chuyền vào bị sai!";
            return callback(err , null);
        } else {
            result = (a + b);
            return callback(null , result);
        }
    }, 1000);
}

sum(7 , 10 , (error, total)=>{
    if(error){
        console.log(error);
        return;
    } else {
        console.log(total);
    }
});
