let getHomeController =  (req, res)=>{
    return res.render("main/home/home",{
        errors: req.flash("errors"),
        success: req.flash("success"),  //nhận mảng error từ postRegister và chuyền sang view auth/master
        user: req.user
    });
};

module.exports = { getHomeController: getHomeController };