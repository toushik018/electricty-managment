import { Request, Response } from 'express';
import { consumerService } from './consumer.service';
import catchAsync from '../../utils/catchAsync';
import sendSuccessResponse from '../../utils/sendResponse';

const registerConsumer = catchAsync(async (req: Request, res: Response) => {
    const consumerData = req.body;
    const result = await consumerService.registerConsumer(consumerData);
    sendSuccessResponse(res, {
        success: true,
        statusCode: 201,
        message: 'Consumer created successfully',
        data: result,
    });
});

const loginConsumer = catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const { accessToken, refreshToken, consumer } = await consumerService.loginConsumer(email, password);

    // Set the refresh token in the cookie
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
    });

    sendSuccessResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Consumer logged in successfully',
        data: {
            accessToken,
            consumer
        },
    });
});


const addConsumption = catchAsync(async (req: Request, res: Response) => {
    const { consumerId, units } = req.body;
    const result = await consumerService.addConsumption(consumerId, units);
    sendSuccessResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Consumption added successfully',
        data: result,
    });
});

const checkPaymentStatus = catchAsync(async (req: Request, res: Response) => {
    const { consumerId } = req.params;
    const result = await consumerService.checkPaymentStatus(consumerId);
    sendSuccessResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Payment status retrieved successfully',
        data: result,
    });
});


const getConsumers = catchAsync(async (req: Request, res: Response) => {
    const { page = 1, limit = 4 } = req.query;
    const result = await consumerService.getConsumers(Number(page), Number(limit));
    sendSuccessResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Consumers retrieved successfully',
        data: result.consumers,
        meta: {
            total: result.total,
            page: result.page,
            limit: result.limit,
        }
    });
});
const getLoggedInConsumerDetails = catchAsync(async (req: Request, res: Response) => {
    const consumerId = req.user.id;
    const result = await consumerService.getConsumerDetailsById(consumerId);
    sendSuccessResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Consumer details retrieved successfully',
        data: result,
    });
});


const updateConsumerDetails = catchAsync(async (req: Request, res: Response) => {
    const loggedInConsumerId = req.user.id; 
    const updateData = req.body;
    const result = await consumerService.updateConsumerDetails(loggedInConsumerId, updateData);
    sendSuccessResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Consumer details updated successfully',
        data: result,
    });
});

const changeConsumerPassword = catchAsync(async (req: Request, res: Response) => {
    const consumerId = req.user.id; 
    const { oldPassword, newPassword } = req.body;
    await consumerService.changeConsumerPassword({ id: consumerId }, { oldPassword, newPassword });
    sendSuccessResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Password changed successfully',
        data: null
    });
});

const getConsumerMonthlyBill = catchAsync(async (req: Request, res: Response) => {
    const consumerId = req.user.id; 
    const bill = await consumerService.getConsumerMonthlyBill(consumerId);
    sendSuccessResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Monthly bill retrieved successfully',
        data: bill,
    });
});

const payBill = catchAsync(async (req: Request, res: Response) => {
    const consumerId = req.user.id; 
    const { amount } = req.body;
  
    const updatedConsumer = await consumerService.payBill(consumerId, amount);
  
    sendSuccessResponse(res, {
      success: true,
      statusCode: 200,
      message: "Bill paid successfully",
      data: updatedConsumer,
    });
  });


export const ConsumerController = {
    registerConsumer,
    loginConsumer,
    addConsumption,
    checkPaymentStatus,
    getConsumers,
    getLoggedInConsumerDetails,
    updateConsumerDetails,
    changeConsumerPassword,
    getConsumerMonthlyBill,
    payBill
};
