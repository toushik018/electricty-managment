import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendSuccessResponse from '../../utils/sendResponse';
import { adminService } from './admin.service';
import config from '../../config';


const createAdmin = catchAsync(async (req: Request, res: Response) => {
    const adminData = req.body;
    const result = await adminService.registerAdmin(adminData);
    sendSuccessResponse(res, {
        success: true,
        statusCode: 201,
        message: 'Admin created successfully',
        data: result,
    });
});


const loginAdmin = catchAsync(async (req: Request, res: Response) => {
    const { username, password } = req.body;
    const { admin, accessToken, refreshToken } = await adminService.loginAdmin(username, password);

    res.cookie('refreshToken', refreshToken, {
        secure: config.NODE_ENV === 'production',
        httpOnly: true,
    })
    sendSuccessResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Admin logged in successfully',
        data: {
            user: admin,
            token: accessToken,
        },
    });
});


const getLoggedInUser = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const role = req.user?.role;

    const user = await adminService.getLoggedInUser(userId, role);

    sendSuccessResponse(res, {
        success: true,
        statusCode: 200,
        message: 'User details retrieved successfully',
        data: user,
    });
});


const getStats = catchAsync(async (req: Request, res: Response) => {
    const stats = await adminService.getStats();
  
    sendSuccessResponse(res, {
      success: true,
      statusCode: 200,
      message: 'Statistics retrieved successfully',
      data: stats,
    });
  });
  

export const AdminController = {
    createAdmin,
    loginAdmin,
    getLoggedInUser,
    getStats
};
