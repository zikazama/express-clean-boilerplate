import express from 'express';
import bodyParser from 'body-parser';
import { UserController } from './controllers/UserController';
import { NotificationController } from './controllers/NotificationController';
import { authMiddleware } from './middleware/auth';
import http from 'http';
import { WebSocketManager } from './websocket/WebSocketServer';
import connectDB from './config/database';

const app = express();
const userController = new UserController();
const notificationController = new NotificationController();

connectDB();

app.use(bodyParser.json());

app.post('/register', userController.register);
app.post('/login', userController.login);
app.get('/user/:id', authMiddleware, userController.getUser);
app.put('/user/:id', authMiddleware, userController.updateUser);
app.delete('/user/:id', authMiddleware, userController.deleteUser);
app.post('/notify', authMiddleware, notificationController.send);

const server = http.createServer(app);

const webSocketManager = new WebSocketManager(server);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
