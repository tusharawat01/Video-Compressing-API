import { Router } from "express";
import {getAllVideos, handleVideoUpload} from "../controllers/upload.controller.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

router.route("/uploadFiles").post(upload.array('videos'), handleVideoUpload);

router.route("/getFiles").get(getAllVideos);

export default router;