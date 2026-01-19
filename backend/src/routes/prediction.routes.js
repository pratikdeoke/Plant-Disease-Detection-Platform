import { Router } from "express";
import { predictImage, getMyPredictions, getAllPredictions } from "../controllers/prediction.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/rbac.middleware.js";
import { upload } from "../utils/upload.js";

const router = Router();

router.post(
  "/",
  authenticate,
  upload.single("image"),
  predictImage
);

router.get(
  "/my",
  authenticate,
  getMyPredictions
);

router.get(
  "/all",
  authenticate,
  authorize(["ADMIN"]),
  getAllPredictions
);

export default router;
