let sum  = (a , b) => {
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            let err , result;
            if(typeof a != "number" || typeof b != "number"){
                return reject("giá trị chuyền vào sai!!!");
            } else {
                resolve(a + b);
            }
        }, 1000);
    })
};

sum (7, 10).then((total)=>sum(total ,10)).then((total1=>{
    console.log(total1);
})).catch((err)=>{
    console.log(err);
});