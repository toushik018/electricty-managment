import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import catchAsync from '../utils/catchAsync';
import { AppError } from '../Errors/AppError';
import { Admin } from '../module/admin/admin.model';
import { Consumer } from '../module/consumer/consumer.model';

const auth = (...requiredRoles: string[]) => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        let token = req.headers.authorization;

        // Checking if the token is missing
        if (!token) {
            throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
        }

        // Handle the case where the token is prefixed with "Bearer "
        if (token.startsWith('Bearer ')) {
            token = token.split(' ')[1];
        }

        // Verify the token
        let decoded;
        try {
            decoded = jwt.verify(token, config.jwt_access_secret as string) as JwtPayload;
        } catch (err) {
            throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized');
        }

        const { role, id } = decoded as { role: string; id: string };

        // Checking if the user exists
        let user;
        if (role === 'admin') {
            user = await Admin.findById(id).select('+username');
        } else if (role === 'consumer') {
            user = await Consumer.findById(id).select('+email');
        }

        if (!user) {
            throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
        }

        // Checking if the role is authorized
        if (requiredRoles.length && !requiredRoles.includes(role)) {
            throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
        }

        req.user = { id, role };
        next();
    });
};

export default auth;
