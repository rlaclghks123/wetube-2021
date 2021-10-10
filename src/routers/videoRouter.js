import express from "express";
import {getEdit,watch,postEdit,upload} from "../controllers/videoController";


const videoRouter = express.Router();






videoRouter.get("/upload", upload);
videoRouter.get("/:id", watch);
videoRouter.route("/:id/edit").get(getEdit).post(postEdit);







export default videoRouter;