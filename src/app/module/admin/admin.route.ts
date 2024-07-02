import express from 'express'
import { AdminController } from './admin.controller'
import auth from '../../middleware/auth';

const router = express.Router()
router.get('/me', auth('admin'), AdminController.getLoggedInUser);
router.get('/stats', AdminController.getStats);
router.post(
    '/register',
    AdminController.createAdmin,
)
router.post('/login', AdminController.loginAdmin);
export const AdminRoutes = router
