require('dotenv').config();
import session from "express-session";
import connectMongo from "connect-mongo";
let MongoStore = connectMongo(session);
/**
 *  lưu session vào mongoDB
 */

let sessionStore = new MongoStore({
    url: `${ process.env.DB_CONNECTION }://${ process.env.DB_HOST }:${ process.env.DB_PORT }/${ process.env.DB_NAME }`,
    autoReconnect : true,
    autoRemove: "native" // khi cookie hết hạn sẽ tự xóa cookie trong mongoDB
})

/**
 * 
 * @param {*} app from express module
 */
let config = ( app )=>{
    app.use(session({ 
        key: process.env.SESSION_KEY, //phải giống key bên socket io passport
        secret: process.env.SESSION_SECRET, //phải giống secret bên socket io passport
        store: sessionStore,
        resave: true,
        saveUninitialized: false,
        cookie: { maxAge: 1000 * 60 * 60 * 24 }
    }));
};

module.exports = {config: config  , sessionStore: sessionStore};