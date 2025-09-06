import {
  getConfigurationById,
  updateConfigurationRemark,
} from "../controllers/configController.js";
import { Router } from "express";

const router = Router();

router.get(`/configurations/:id`, getConfigurationById);

router.put(`/configurations/:id`, updateConfigurationRemark);

export default router;
