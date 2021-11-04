import express from "express";
import {startGithubLogin,logout,finishGithubLogin,getEdit,postEdit,getChangePassword,postChangePassword} from "../controllers/userController";
import {privateMiddleWare,publicOnlyMiddleWare,uploadFiles} from "../middleware";







const userRouter = express.Router();

userRouter.get("/logout",privateMiddleWare, logout);
userRouter.route("/edit-profile").all(privateMiddleWare).get(getEdit).post(uploadFiles.single("avatar"),postEdit);
userRouter.route("/change-password").all(privateMiddleWare).get(getChangePassword).post(postChangePassword);
userRouter.get("/github/start",publicOnlyMiddleWare, startGithubLogin);
userRouter.get("/github/finish",publicOnlyMiddleWare, finishGithubLogin);




export default userRouter;