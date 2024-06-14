import WebSocket, { WebSocketServer } from 'ws';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

interface WebSocketWithAuth extends WebSocket {
    isAuthenticated?: boolean;
}

export class WebSocketManager {
    private wss: WebSocketServer;

    constructor(server: any) {
        this.wss = new WebSocketServer({ server });

        this.wss.on('connection', (ws: WebSocketWithAuth, req) => {
            const token = req.url?.split('token=')[1];
            if (token) {
                try {
                    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
                    ws.isAuthenticated = true;
                    ws.send('Authentication successful');
                } catch (err) {
                    ws.send('Authentication failed');
                    ws.close();
                }
            } else {
                ws.send('No token provided');
                ws.close();
            }

            ws.on('message', (message: string) => {
                if (ws.isAuthenticated) {
                    this.broadcast(message, ws);
                } else {
                    ws.send('Authentication required');
                }
            });
        });
    }

    broadcast(data: string, excludeWs?: WebSocketWithAuth) {
        this.wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN && client !== excludeWs && (client as WebSocketWithAuth).isAuthenticated) {
                client.send(data);
            }
        });
    }
}
