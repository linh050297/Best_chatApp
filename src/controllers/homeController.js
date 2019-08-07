let getHomeController =  (req, res)=>{
    return res.render("main/master");
};

module.exports = { getHomeController: getHomeController };