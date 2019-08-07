let getHomeController =  (req, res)=>{
    return res.render("main/home/home");
};

module.exports = { getHomeController: getHomeController };