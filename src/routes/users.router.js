import { Router } from "express";
import { getUsers, deleteInactiveUsers, swapUserRole, uploadDocuments } from '../controllers/users.controller.js';
import { passportCall } from '../util.js';
import uploadConfig from '../config/multer.config.js';

const router = Router();

router.get('/', getUsers);
router.delete('/', deleteInactiveUsers);
router.post('/premium/:uid', passportCall('jwt'), swapUserRole);
router.post('/:uid/documents', passportCall('jwt'), uploadConfig.any(), uploadDocuments);

export default router;