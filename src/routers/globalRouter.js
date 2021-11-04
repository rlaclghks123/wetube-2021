import express from "express";
import {home,search} from "../controllers/videoController";
import {getJoin,getLogin,postJoin,postLogin} from "../controllers/userController";
import {privateMiddleWare,publicOnlyMiddleWare} from "../middleware";

const globalRouter = express.Router();


globalRouter.get("/", home);
globalRouter.route("/join").all(publicOnlyMiddleWare).get(getJoin).post(postJoin);
globalRouter.route("/login").all(publicOnlyMiddleWare).get(getLogin).post(postLogin);
globalRouter.get("/search", search);
globalRouter.get("/hello");



export default globalRouter;