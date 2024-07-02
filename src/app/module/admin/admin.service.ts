import httpStatus from "http-status"
import { IAdmin } from "./admin.interface"
import { Admin } from "./admin.model"
import { AppError } from "../../Errors/AppError"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import config from "../../config"
import { Consumer } from "../consumer/consumer.model"

const registerAdmin = async (payload: IAdmin): Promise<IAdmin> => {
    const existingAdmin = await Admin.isUserExistsByUsername(payload.username);
    if (existingAdmin) {
        throw new AppError(httpStatus.BAD_REQUEST, `${payload.username} this user already exists`);
    }

    payload.role = 'admin';
    const admin = new Admin(payload);
    admin.password = await bcrypt.hash(payload.password, 10);
    await admin.save();

    return admin;
};


const loginAdmin = async (username: string, password: string): Promise<{ accessToken: string, refreshToken: string, admin: IAdmin }> => {
    const admin = await Admin.isUserExistsByUsername(username);
    if (!admin) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Invalid credentials");
    }

    const accessToken = jwt.sign({ id: admin.id, username: admin.username, role: admin.role }, config.jwt_access_secret as string, {
        expiresIn: '1d'
    });
    const refreshToken = jwt.sign({ id: admin.id, username: admin.username, role: admin.role }, config.jwt_refresh_secret as string, {
        expiresIn: '7d'
    });

    return {
        accessToken,
        refreshToken,
        admin
    };
};



const getLoggedInUser = async (userId: string, role: string) => {
    let user;
    if (role === 'admin') {
        user = await Admin.findById(userId).select('-password');
    } else if (role === 'consumer') {
        user = await Consumer.findById(userId).select('-password');
    }

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    return user;
};

const getStats = async () => {
    const totalConsumers = await Consumer.countDocuments();
    const totalAdmins = await Admin.countDocuments();
    const totalUnpaidBills = await Consumer.countDocuments({ isBillPaid: false });

    return {
        totalConsumers,
        totalAdmins,
        totalUnpaidBills,
    };
};

export const adminService = {
    registerAdmin,
    loginAdmin,
    getLoggedInUser,
    getStats
}