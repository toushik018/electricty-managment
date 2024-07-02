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
exports.adminService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const admin_model_1 = require("./admin.model");
const AppError_1 = require("../../Errors/AppError");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config"));
const consumer_model_1 = require("../consumer/consumer.model");
const registerAdmin = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingAdmin = yield admin_model_1.Admin.isUserExistsByUsername(payload.username);
    if (existingAdmin) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, `${payload.username} this user already exists`);
    }
    payload.role = 'admin';
    const admin = new admin_model_1.Admin(payload);
    admin.password = yield bcrypt_1.default.hash(payload.password, 10);
    yield admin.save();
    return admin;
});
const loginAdmin = (username, password) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = yield admin_model_1.Admin.isUserExistsByUsername(username);
    if (!admin) {
        throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, "Invalid credentials");
    }
    const isMatch = yield bcrypt_1.default.compare(password, admin.password);
    if (!isMatch) {
        throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, "Invalid credentials");
    }
    const accessToken = jsonwebtoken_1.default.sign({ id: admin.id, username: admin.username, role: admin.role }, config_1.default.jwt_access_secret, {
        expiresIn: '1d'
    });
    const refreshToken = jsonwebtoken_1.default.sign({ id: admin.id, username: admin.username, role: admin.role }, config_1.default.jwt_refresh_secret, {
        expiresIn: '7d'
    });
    return {
        accessToken,
        refreshToken,
        admin
    };
});
const getLoggedInUser = (userId, role) => __awaiter(void 0, void 0, void 0, function* () {
    let user;
    if (role === 'admin') {
        user = yield admin_model_1.Admin.findById(userId).select('-password');
    }
    else if (role === 'consumer') {
        user = yield consumer_model_1.Consumer.findById(userId).select('-password');
    }
    if (!user) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'User not found');
    }
    return user;
});
const getStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalConsumers = yield consumer_model_1.Consumer.countDocuments();
    const totalAdmins = yield admin_model_1.Admin.countDocuments();
    const totalUnpaidBills = yield consumer_model_1.Consumer.countDocuments({ isBillPaid: false });
    return {
        totalConsumers,
        totalAdmins,
        totalUnpaidBills,
    };
});
exports.adminService = {
    registerAdmin,
    loginAdmin,
    getLoggedInUser,
    getStats
};
