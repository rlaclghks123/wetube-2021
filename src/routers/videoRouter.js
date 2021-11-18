import express from "express";
import { getEdit, watch, postEdit, getUpload, postUpload, deleteVideo } from "../controllers/videoController";
import { privateMiddleWare, videoUpload } from "../middleware";

const videoRouter = express.Router();






videoRouter.route("/upload").all(privateMiddleWare).get(getUpload).post(videoUpload.fields([{ name: "video", maxCount: 1 }, { name: "thumb", maxCount: 1 }]), postUpload);
videoRouter.get("/:id([0-9a-f]{24})", watch);
videoRouter.route("/:id([0-9a-f]{24})/edit").all(privateMiddleWare).get(getEdit).post(postEdit);
videoRouter.get("/:id([0-9a-f]{24})/delete", privateMiddleWare, deleteVideo);







export default videoRouter;