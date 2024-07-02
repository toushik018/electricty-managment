"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendSuccessResponse = (res, { statusCode, message, data, meta }) => {
    res.status(statusCode).json({
        success: true,
        message,
        data,
        meta,
    });
};
exports.default = sendSuccessResponse;
