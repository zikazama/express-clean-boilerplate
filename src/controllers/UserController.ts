import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { UserRepository } from '../infrastructure/repositories/UserRepository';

dotenv.config();

const userService = new UserService(new UserRepository());

export class UserController {
    async register(req: Request, res: Response) {
        const { name, email, password } = req.body;
        await userService.createUser(name, email, password);
        res.status(201).send('User created');
    }

    async login(req: Request, res: Response) {
        const { email, password } = req.body;
        const isValid = await userService.validatePassword(email, password);
        if (isValid) {
            const token = jwt.sign({ email }, process.env.JWT_SECRET!, { expiresIn: '1h' });
            res.json({ token });
        } else {
            res.status(401).send('Invalid credentials');
        }
    }

    async getUser(req: Request, res: Response) {
        const { id } = req.params;
        const user = await userService.getUserById(id);
        if (user) {
            res.json(user);
        } else {
            res.status(404).send('User not found');
        }
    }

    async updateUser(req: Request, res: Response) {
        const { id } = req.params;
        const { name, email } = req.body;
        await userService.updateUser(id, name, email);
        res.send('User updated');
    }

    async deleteUser(req: Request, res: Response) {
        const { id } = req.params;
        await userService.deleteUser(id);
        res.send('User deleted');
    }
}
