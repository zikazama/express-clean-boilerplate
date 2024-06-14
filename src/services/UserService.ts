import { IUserRepository } from '../domain/repositories/IUserRepository';
import { User } from '../domain/entities/User';
import bcrypt from 'bcryptjs';

export class UserService {
    constructor(private userRepository: IUserRepository) {}

    async createUser(name: string, email: string, password: string): Promise<void> {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user: User = { id: Date.now().toString(), name, email, password: hashedPassword };
        await this.userRepository.save(user);
    }

    async getUserById(id: string): Promise<User | null> {
        return this.userRepository.findById(id);
    }

    async getUserByEmail(email: string): Promise<User | null> {
        return this.userRepository.findByEmail(email);
    }

    async updateUser(id: string, name: string, email: string): Promise<void> {
        const user = await this.userRepository.findById(id);
        if (user) {
            user.name = name;
            user.email = email;
            await this.userRepository.update(user);
        }
    }

    async deleteUser(id: string): Promise<void> {
        await this.userRepository.delete(id);
    }

    async validatePassword(email: string, password: string): Promise<boolean> {
        const user = await this.userRepository.findByEmail(email);
        if (user) {
            return bcrypt.compare(password, user.password);
        }
        return false;
    }
}
