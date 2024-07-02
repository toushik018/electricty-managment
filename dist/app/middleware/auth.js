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
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const AppError_1 = require("../Errors/AppError");
const admin_model_1 = require("../module/admin/admin.model");
const consumer_model_1 = require("../module/consumer/consumer.model");
const auth = (...requiredRoles) => {
    return (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        let token = req.headers.authorization;
        // Checking if the token is missing
        if (!token) {
            throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, 'You are not authorized!');
        }
        // Handle the case where the token is prefixed with "Bearer "
        if (token.startsWith('Bearer ')) {
            token = token.split(' ')[1];
        }
        // Verify the token
        let decoded;
        try {
            decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_access_secret);
        }
        catch (err) {
            throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, 'Unauthorized');
        }
        const { role, id } = decoded;
        // Checking if the user exists
        let user;
        if (role === 'admin') {
            user = yield admin_model_1.Admin.findById(id).select('+username');
        }
        else if (role === 'consumer') {
            user = yield consumer_model_1.Consumer.findById(id).select('+email');
        }
        if (!user) {
            throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'This user is not found!');
        }
        // Checking if the role is authorized
        if (requiredRoles.length && !requiredRoles.includes(role)) {
            throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, 'You are not authorized!');
        }
        req.user = { id, role };
        next();
    }));
};
exports.default = auth;
