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
exports.AdminController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const admin_service_1 = require("./admin.service");
const config_1 = __importDefault(require("../../config"));
const createAdmin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const adminData = req.body;
    const result = yield admin_service_1.adminService.registerAdmin(adminData);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 201,
        message: 'Admin created successfully',
        data: result,
    });
}));
const loginAdmin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const { admin, accessToken, refreshToken } = yield admin_service_1.adminService.loginAdmin(username, password);
    res.cookie('refreshToken', refreshToken, {
        secure: config_1.default.NODE_ENV === 'production',
        httpOnly: true,
    });
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: 'Admin logged in successfully',
        data: {
            user: admin,
            token: accessToken,
        },
    });
}));
const getLoggedInUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const role = (_b = req.user) === null || _b === void 0 ? void 0 : _b.role;
    const user = yield admin_service_1.adminService.getLoggedInUser(userId, role);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: 'User details retrieved successfully',
        data: user,
    });
}));
const getStats = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const stats = yield admin_service_1.adminService.getStats();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: 'Statistics retrieved successfully',
        data: stats,
    });
}));
exports.AdminController = {
    createAdmin,
    loginAdmin,
    getLoggedInUser,
    getStats
};
