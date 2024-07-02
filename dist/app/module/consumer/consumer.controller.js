"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsumerController = void 0;
const consumer_service_1 = require("./consumer.service");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const registerConsumer = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const consumerData = req.body;
    const result = yield consumer_service_1.consumerService.registerConsumer(consumerData);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 201,
        message: 'Consumer created successfully',
        data: result,
    });
}));
const loginConsumer = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const { accessToken, refreshToken, consumer } = yield consumer_service_1.consumerService.loginConsumer(email, password);
    // Set the refresh token in the cookie
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
    });
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: 'Consumer logged in successfully',
        data: {
            accessToken,
            consumer
        },
    });
}));
const addConsumption = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { consumerId, units } = req.body;
    const result = yield consumer_service_1.consumerService.addConsumption(consumerId, units);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: 'Consumption added successfully',
        data: result,
    });
}));
const checkPaymentStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { consumerId } = req.params;
    const result = yield consumer_service_1.consumerService.checkPaymentStatus(consumerId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: 'Payment status retrieved successfully',
        data: result,
    });
}));
const getConsumers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 1, limit = 4 } = req.query;
    const result = yield consumer_service_1.consumerService.getConsumers(Number(page), Number(limit));
    (0, sendResponse_1.default)(res, {
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
}));
const getLoggedInConsumerDetails = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const consumerId = req.user.id;
    const result = yield consumer_service_1.consumerService.getConsumerDetailsById(consumerId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: 'Consumer details retrieved successfully',
        data: result,
    });
}));
const updateConsumerDetails = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loggedInConsumerId = req.user.id;
    const updateData = req.body;
    const result = yield consumer_service_1.consumerService.updateConsumerDetails(loggedInConsumerId, updateData);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: 'Consumer details updated successfully',
        data: result,
    });
}));
const changeConsumerPassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const consumerId = req.user.id;
    const { oldPassword, newPassword } = req.body;
    yield consumer_service_1.consumerService.changeConsumerPassword({ id: consumerId }, { oldPassword, newPassword });
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: 'Password changed successfully',
        data: null
    });
}));
const getConsumerMonthlyBill = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const consumerId = req.user.id;
    const bill = yield consumer_service_1.consumerService.getConsumerMonthlyBill(consumerId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: 'Monthly bill retrieved successfully',
        data: bill,
    });
}));
const payBill = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const consumerId = req.user.id;
    const { amount } = req.body;
    const updatedConsumer = yield consumer_service_1.consumerService.payBill(consumerId, amount);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Bill paid successfully",
        data: updatedConsumer,
    });
}));
exports.ConsumerController = {
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
