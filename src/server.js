
import express from "express";
import morgan from "morgan";
import session from "express-session";
import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import MongoStore from "connect-mongo";
import {localMiddleware} from "./middleware"



const app = express();
const logger = morgan("dev");

//setting
app.set("view engine", "pug");
app.set("views", process.cwd()+ "/src/views");

//Middle Ware
app.use(logger)
app.use(express.urlencoded({extended:true}));
app.use(session({
    secret:process.env.COOKIE_SECRET,
    resave:false,
    saveUninitialized:false,
    store:MongoStore.create({mongoUrl:process.env.API_KEY}),
}));
app.use(localMiddleware);
app.use("/uploads", express.static("uploads"));
app.use("/static", express.static("assets"));

//Router
app.use("/", globalRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);

export default app;







