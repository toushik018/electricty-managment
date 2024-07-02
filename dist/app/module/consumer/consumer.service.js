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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.consumerService = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
const http_status_1 = __importDefault(require("http-status"));
const consumer_model_1 = require("./consumer.model");
const AppError_1 = require("../../Errors/AppError");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config"));
const DEFAULT_PASSWORD = "123456";
const registerConsumer = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingConsumer = yield consumer_model_1.Consumer.isConsumerExistsByEmail(payload.email);
    if (existingConsumer) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, `${payload.email} this consumer already exists`);
    }
    const saltRounds = parseInt(config_1.default.becrypt_salt, 10);
    payload.password = yield bcrypt_1.default.hash(DEFAULT_PASSWORD, saltRounds);
    const result = yield consumer_model_1.Consumer.create(payload);
    return result;
});
const loginConsumer = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const consumer = yield consumer_model_1.Consumer.isConsumerExistsByEmail(email);
    if (!consumer) {
        throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, "Consumer not found");
    }
    const isMatch = yield bcrypt_1.default.compare(password, consumer.password);
    if (!isMatch) {
        throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, "Invalid credentials");
    }
    const accessToken = jsonwebtoken_1.default.sign({ id: consumer.id, email: consumer.email, role: 'consumer' }, config_1.default.jwt_access_secret, {
        expiresIn: '1d'
    });
    const refreshToken = jsonwebtoken_1.default.sign({ id: consumer.id, email: consumer.email, role: 'consumer' }, config_1.default.jwt_refresh_secret, {
        expiresIn: '7d'
    });
    const _a = consumer.toObject(), { password: _ } = _a, consumerWithoutPassword = __rest(_a, ["password"]);
    return {
        accessToken,
        refreshToken,
        consumer: consumerWithoutPassword
    };
});
const addConsumption = (consumerId, units) => __awaiter(void 0, void 0, void 0, function* () {
    const consumer = yield consumer_model_1.Consumer.findById(consumerId);
    if (!consumer) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Consumer not found');
    }
    consumer.unitsConsumed += units;
    consumer.billAmount = calculateBill(consumer.unitsConsumed);
    yield consumer.save();
    return consumer;
});
// Bill calculation logic
const calculateBill = (units) => {
    if (units <= 150) {
        return 200;
    }
    else if (units <= 300) {
        return 200 + (units - 150) * 1.2;
    }
    else if (units <= 500) {
        return 200 + (150 * 1.2) + (units - 300) * 1.5;
    }
    else {
        return 200 + (150 * 1.2) + (200 * 1.5) + (units - 500) * 2;
    }
};
const checkPaymentStatus = (consumerId) => __awaiter(void 0, void 0, void 0, function* () {
    const consumer = yield consumer_model_1.Consumer.findById(consumerId);
    if (!consumer) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Consumer not found');
    }
    return { isBillPaid: consumer.isBillPaid };
});
const getConsumers = (page, limit) => __awaiter(void 0, void 0, void 0, function* () {
    const skip = (page - 1) * limit;
    const total = yield consumer_model_1.Consumer.countDocuments();
    const consumers = yield consumer_model_1.Consumer.find().skip(skip).limit(limit);
    return { consumers, total, page, limit };
});
const getConsumerDetailsById = (consumerId) => __awaiter(void 0, void 0, void 0, function* () {
    const consumer = yield consumer_model_1.Consumer.findById(consumerId).select('-password');
    if (!consumer) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Consumer not found');
    }
    return consumer;
});
const updateConsumerDetails = (consumerId, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    const updatableFields = ['name', 'contactNumber'];
    const updatePayload = {};
    for (const field of updatableFields) {
        if (updateData[field]) {
            updatePayload[field] = updateData[field];
        }
    }
    const consumer = yield consumer_model_1.Consumer.findByIdAndUpdate(consumerId, updatePayload, { new: true, runValidators: true }).select('-password');
    if (!consumer) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Consumer not found');
    }
    return consumer;
});
const changeConsumerPassword = (userData, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const consumer = yield consumer_model_1.Consumer.findById(userData.id).select('+password');
    if (!consumer) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'This consumer is not found!');
    }
    const isMatch = yield bcrypt_1.default.compare(payload.oldPassword, consumer.password);
    if (!isMatch) {
        throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, 'Old password is incorrect');
    }
    consumer.password = yield bcrypt_1.default.hash(payload.newPassword, 10);
    yield consumer.save();
});
const getConsumerMonthlyBill = (consumerId) => __awaiter(void 0, void 0, void 0, function* () {
    const consumer = yield consumer_model_1.Consumer.findById(consumerId);
    if (!consumer) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Consumer not found');
    }
    return {
        unitsConsumed: consumer.unitsConsumed,
        billAmount: consumer.billAmount,
        isBillPaid: consumer.isBillPaid
    };
});
const payBill = (consumerId, amount) => __awaiter(void 0, void 0, void 0, function* () {
    const consumer = yield consumer_model_1.Consumer.findById(consumerId);
    if (!consumer) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "Consumer not found");
    }
    if (amount !== consumer.billAmount) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "Payment amount does not match the bill amount");
    }
    consumer.billAmount = 0;
    consumer.isBillPaid = true;
    yield consumer.save();
    return consumer;
});
exports.consumerService = {
    registerConsumer,
    loginConsumer,
    addConsumption,
    checkPaymentStatus,
    getConsumers,
    getConsumerDetailsById,
    updateConsumerDetails,
    changeConsumerPassword,
    getConsumerMonthlyBill,
    payBill
};
