import { Schema, model } from 'mongoose';
import { IAdmin, AdminModel } from './admin.interface';

const AdminSchema = new Schema<IAdmin>({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'admin' }
});

AdminSchema.statics.isUserExistsByUsername = async function (username: string) {
    return await this.findOne({ username }).select('+password');
};

export const Admin = model<IAdmin, AdminModel>('Admin', AdminSchema);
