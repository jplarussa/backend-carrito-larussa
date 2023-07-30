import { Router } from "express";
import { getUsers, deleteInactiveUsers, swapUserRole, uploadDocuments, deleteUser } from '../controllers/users.controller.js';
import { passportCall } from '../util.js';
import uploadConfig from '../config/multer.config.js';

const router = Router();

router.get('/', getUsers);
router.delete('/', passportCall('jwt'), deleteInactiveUsers);
router.delete('/:uid', deleteUser);
router.post('/premium/:uid', passportCall('jwt'), swapUserRole);
router.post('/:uid/documents', passportCall('jwt'), uploadConfig.any(), uploadDocuments);

export default router;