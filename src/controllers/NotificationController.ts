import { Request, Response } from 'express';
import { NotificationService } from '../services/NotificationService';

const notificationService = new NotificationService();

export class NotificationController {
    async send(req: Request, res: Response) {
        const { token, title, body, data } = req.body;
        await notificationService.sendNotification(token, title, body, data);
        res.status(200).send('Notification sent');
    }
}
