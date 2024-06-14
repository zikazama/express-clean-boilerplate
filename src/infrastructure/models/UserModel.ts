import mongoose, { Schema, Document } from 'mongoose';
import { User } from '../../domain/entities/User';

interface IUserDocument extends Document, Omit<User, 'id'> {}

const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

export default mongoose.model<IUserDocument>('User', UserSchema);
