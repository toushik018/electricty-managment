/* eslint-disable no-unused-vars */
import { Document, Model } from "mongoose";

export interface IConsumer extends Document {
    id: string;
    name: string;
    email: string;
    password: string;
    contactNumber: string;
    unitsConsumed: number;
    isBillPaid: boolean;
    billAmount: number;
    role: 'consumer';
}

export interface ConsumerModel extends Model<IConsumer> {
    isConsumerExistsByEmail(email: string): Promise<IConsumer | null>;
}
