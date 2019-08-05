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

(async ()=>{
    try {
        let total01 = await sum(7,10);
        let total2 = await sum(total01 ,10);
        console.log(total2);
        console.log(total01);
    } catch (error) {
        console.log(error);
    }
})();
