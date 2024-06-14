import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';
import UserModel from '../models/UserModel';

export class UserRepository implements IUserRepository {
    private toUser(doc: any): User | null {
        if (!doc) return null;
        const { _id, ...rest } = doc;
        return { id: _id.toString(), ...rest } as User;
    }

    async findById(id: string): Promise<User | null> {
        const doc = await UserModel.findById(id).lean().exec();
        return this.toUser(doc);
    }

    async findByEmail(email: string): Promise<User | null> {
        const doc = await UserModel.findOne({ email }).lean().exec();
        return this.toUser(doc);
    }

    async save(user: User): Promise<void> {
        const newUser = new UserModel(user);
        await newUser.save();
    }

    async update(user: User): Promise<void> {
        const { id, ...rest } = user;
        await UserModel.findByIdAndUpdate(id, rest).exec();
    }

    async delete(id: string): Promise<void> {
        await UserModel.findByIdAndDelete(id).exec();
    }
}
