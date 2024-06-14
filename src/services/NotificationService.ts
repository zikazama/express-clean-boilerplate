import admin from '../config/firebase';

export class NotificationService {
    async sendNotification(token: string, title: string, body: string, data?: object) {
        const message: admin.messaging.Message = {
            notification: {
                title,
                body,
            },
            data: data ? data as admin.messaging.DataMessagePayload : {},
            token,
        };

        try {
            const response = await admin.messaging().send(message);
            console.log('Successfully sent message:', response);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    }
}
