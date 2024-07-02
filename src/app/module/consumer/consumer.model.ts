import { Schema, model } from 'mongoose';
import { IConsumer, ConsumerModel } from './consumer.interface';

const ConsumerSchema = new Schema<IConsumer>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    contactNumber: { type: String, required: true },
    password: { type: String, required: true },
    unitsConsumed: { type: Number, required: true, default: 0 },
    isBillPaid: { type: Boolean, required: true, default: false },
    billAmount: { type: Number, required: true, default: 0 },
    role: { type: String, default: 'consumer' }
});

ConsumerSchema.statics.isConsumerExistsByEmail = async function (email: string) {
    return await this.findOne({ email }).select('+password').select('+email');
};

export const Consumer = model<IConsumer, ConsumerModel>('Consumer', ConsumerSchema);
