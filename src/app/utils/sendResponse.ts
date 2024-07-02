import { Response } from 'express'

type TResponse<T> = {
    success: boolean;
    statusCode: number;
    message: string;
    data: T;
    meta?: {
        total: number;
        page: number;
        limit: number;
    };
};

const sendSuccessResponse = <T>(
    res: Response,
    { statusCode, message, data, meta }: TResponse<T>
) => {
    res.status(statusCode).json({
        success: true,
        message,
        data,
        meta,
    });
};

export default sendSuccessResponse
