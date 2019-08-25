import { notification } from "./../services/index";

let readMore = async (req, res)=>{
    try {
        //get skipnumber from query param
        let skipNumberNotif = +(req.query.skipNumber); //lấy dữ liệu dựa trên query params bên js/readMoreNotif.js
        //get more item
        let newNotifications = await notification.readMore(req.user._id, skipNumberNotif); 
        return res.status(200).send(newNotifications);

    } catch (error) {
        return res.status(500).send(error);
    }
};

let markAllAsRead = async (req, res)=>{
    try {
        let mark = await notification.markAllAsRead(req.user._id, req.body.targetUsers);
        return res.status(200).send(mark);

    } catch (error) {
        return res.status(500).send(error);
    }
}

module.exports = { readMore: readMore,
                    markAllAsRead: markAllAsRead };