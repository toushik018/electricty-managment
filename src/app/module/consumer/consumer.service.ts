/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import httpStatus from "http-status";
import { IConsumer } from "./consumer.interface";
import { Consumer } from "./consumer.model";
import { AppError } from "../../Errors/AppError";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken"
import config from "../../config";



const DEFAULT_PASSWORD = "123456";

const registerConsumer = async (payload: IConsumer): Promise<IConsumer> => {
    const existingConsumer = await Consumer.isConsumerExistsByEmail(payload.email);
    if (existingConsumer) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `${payload.email} this consumer already exists`
        );
    }

    const saltRounds = parseInt(config.becrypt_salt as string, 10);
    payload.password = await bcrypt.hash(DEFAULT_PASSWORD, saltRounds);
    const result = await Consumer.create(payload);
    return result;
}



const loginConsumer = async (email: string, password: string): Promise<{ accessToken: string, refreshToken: string, consumer: IConsumer }> => {
    const consumer = await Consumer.isConsumerExistsByEmail(email);
    if (!consumer) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Consumer not found");
    }

    const isMatch = await bcrypt.compare(password, consumer.password);
    if (!isMatch) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Invalid credentials");
    }

    const accessToken = jwt.sign({ id: consumer.id, email: consumer.email, role: 'consumer' }, config.jwt_access_secret as string, {
        expiresIn: '1d'
    });
    const refreshToken = jwt.sign({ id: consumer.id, email: consumer.email, role: 'consumer' }, config.jwt_refresh_secret as string, {
        expiresIn: '7d'
    });

    const { password: _, ...consumerWithoutPassword } = consumer.toObject();

    return {
        accessToken,
        refreshToken,
        consumer: consumerWithoutPassword
    };
};


const addConsumption = async (consumerId: string, units: number): Promise<IConsumer> => {
    const consumer = await Consumer.findById(consumerId);
    if (!consumer) {
        throw new AppError(httpStatus.NOT_FOUND, 'Consumer not found');
    }

    consumer.unitsConsumed += units;
    consumer.billAmount = calculateBill(consumer.unitsConsumed);
    await consumer.save();
    return consumer;
};

// Bill calculation logic
const calculateBill = (units: number): number => {
    if (units <= 150) {
        return 200;
    } else if (units <= 300) {
        return 200 + (units - 150) * 1.2;
    } else if (units <= 500) {
        return 200 + (150 * 1.2) + (units - 300) * 1.5;
    } else {
        return 200 + (150 * 1.2) + (200 * 1.5) + (units - 500) * 2;
    }
};


const checkPaymentStatus = async (consumerId: string): Promise<{ isBillPaid: boolean }> => {
    const consumer = await Consumer.findById(consumerId);
    if (!consumer) {
        throw new AppError(httpStatus.NOT_FOUND, 'Consumer not found');
    }

    return { isBillPaid: consumer.isBillPaid };
};


const getConsumers = async (page: number, limit: number): Promise<{ consumers: IConsumer[], total: number, page: number, limit: number }> => {
    const skip = (page - 1) * limit;
    const total = await Consumer.countDocuments();
    const consumers = await Consumer.find().skip(skip).limit(limit);

    return { consumers, total, page, limit };
};

const getConsumerDetailsById = async (consumerId: string): Promise<IConsumer> => {
    const consumer = await Consumer.findById(consumerId).select('-password');
    if (!consumer) {
        throw new AppError(httpStatus.NOT_FOUND, 'Consumer not found');
    }
    return consumer;
};




const updateConsumerDetails = async (consumerId: string, updateData: Partial<IConsumer>): Promise<IConsumer> => {
    const updatableFields = ['name', 'contactNumber'];
    const updatePayload: Partial<IConsumer> = {};

    for (const field of updatableFields) {
        if (updateData[field as keyof IConsumer]) {
            updatePayload[field as keyof IConsumer] = updateData[field as keyof IConsumer];
        }
    }

    const consumer = await Consumer.findByIdAndUpdate(consumerId, updatePayload, { new: true, runValidators: true }).select('-password');
    if (!consumer) {
        throw new AppError(httpStatus.NOT_FOUND, 'Consumer not found');
    }
    return consumer;
};


const changeConsumerPassword = async (userData: JwtPayload, payload: { oldPassword: string; newPassword: string }): Promise<void> => {
    const consumer = await Consumer.findById(userData.id).select('+password');
    if (!consumer) {
        throw new AppError(httpStatus.NOT_FOUND, 'This consumer is not found!');
    }

    const isMatch = await bcrypt.compare(payload.oldPassword, consumer.password);
    if (!isMatch) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'Old password is incorrect');
    }

    consumer.password = await bcrypt.hash(payload.newPassword, 10);
    await consumer.save();
};


const getConsumerMonthlyBill = async (consumerId: string): Promise<{ unitsConsumed: number, billAmount: number, isBillPaid: boolean }> => {
    const consumer = await Consumer.findById(consumerId);
    if (!consumer) {
        throw new AppError(httpStatus.NOT_FOUND, 'Consumer not found');
    }

    return {
        unitsConsumed: consumer.unitsConsumed,
        billAmount: consumer.billAmount,
        isBillPaid: consumer.isBillPaid
    };
};


const payBill = async (consumerId: string, amount: number): Promise<IConsumer> => {
    const consumer = await Consumer.findById(consumerId);
  
    if (!consumer) {
      throw new AppError(httpStatus.NOT_FOUND, "Consumer not found");
    }
  
    if (amount !== consumer.billAmount) {
      throw new AppError(httpStatus.BAD_REQUEST, "Payment amount does not match the bill amount");
    }
  
    consumer.billAmount = 0;
    consumer.isBillPaid = true;
    await consumer.save();
  
    return consumer;
  };


export const consumerService = {
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
