import express from 'express'
import auth from '../../middleware/auth';
import { AdminController } from '../admin/admin.controller';

const router = express.Router()

router.get('/me', auth('admin', 'consumer'), AdminController.getLoggedInUser);

export const ProfileRoutes = router