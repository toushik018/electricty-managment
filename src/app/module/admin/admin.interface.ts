/* eslint-disable no-unused-vars */
import { Document, Model } from "mongoose";

export interface IAdmin extends Document {
    id: string;
    username: string;
    password: string;
    role: 'admin';
}

export interface AdminModel extends Model<IAdmin> {
    isUserExistsByUsername(username: string): Promise<IAdmin | null>;
}
