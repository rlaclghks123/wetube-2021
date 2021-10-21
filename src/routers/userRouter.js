import express from "express";
import {edit,startGithubLogin,logout,see,finishGithubLogin,getEdit,postEdit,getChangePassword,postChangePassword} from "../controllers/userController";
import {privateMiddleWare,publicOnlyMiddleWare} from "../middleware";







const userRouter = express.Router();

userRouter.get("/logout",privateMiddleWare, logout);
userRouter.route("/edit-profile").all(privateMiddleWare).get(getEdit).post(postEdit);
userRouter.route("/change-password").all(privateMiddleWare).get(getChangePassword).post(postChangePassword);
userRouter.get("/github/start",publicOnlyMiddleWare, startGithubLogin);
userRouter.get("/github/finish",publicOnlyMiddleWare, finishGithubLogin);
// userRouter.get("/:id(\\d+)", see);



export default userRouter;