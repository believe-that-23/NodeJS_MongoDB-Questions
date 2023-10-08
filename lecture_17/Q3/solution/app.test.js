// messageRetrieval.test.js

import mongoose from 'mongoose';
import { messageModel as Message } from './message.schema.js';
import { connectToDatabase } from './db.config.js';
import { Server } from 'socket.io';
import { io } from 'socket.io-client';
import { Server as HttpServer, createServer } from 'http';
import { app } from './server.js';

let server;
let socketClient1;
const socketURL = "http://localhost:3001";

beforeAll(async () => {
    // Connect to a test MongoDB database (you can use an in-memory database)
    connectToDatabase();

    // Create an HTTP server and Socket.IO instance for testing
    server = createServer(app);
    const ioServer = new Server(server);
    await new Promise((resolve) => {
        server.listen(3001, resolve);
    }); // Use a separate port for testing

    // Connect socket client to the server
    socketClient1 = io(socketURL);
});

afterAll(async () => {
    // Close the Mongoose connection and server after tests are done
    await mongoose.connection.close();
    socketClient1.disconnect();
    server.close();
});

describe('Message Retrieval', () => {
    beforeEach(async () => {
        // Clear the 'messages' collection before each test
        await Message.deleteMany({});
    });

    it('should retrieve previous messages for a user when joining a room', async () => {
        // Create a new message with a timestamp within the specified time range
        const timestampWithinRange = new Date(Date.now() - 12 * 60 * 60 * 1000); // 12 hours ago
        const messageWithinRange = new Message({
            username: 'testUser',
            text: 'Hello, world!',
            room: 'testRoom',
            timestamp: timestampWithinRange,
        });

        await messageWithinRange.save();

        // Simulate a user joining the room
        socketClient1.emit('join', { username: 'testUser', room: 'testRoom' });

        const previousMessagesPromise = new Promise((resolve) => {
            socketClient1.on('previousMessages', (previousMessages) => {
                // Assert that only the message within the specified time range is retrieved
                expect(previousMessages.length).toBe(1);
                expect(previousMessages[0].text).toBe('Hello, world!');
                resolve();
            });
        });

        // Simulate other events, if needed, while waiting for previousMessagesPromise
        const sendMessagePromise = new Promise((resolve) => {
            socketClient1.emit('sendMessage', {
                username: 'testUser',
                message: 'Hello from User1!',
                room: 'testRoom',
            });
            socketClient1.on('message', (message) => {
                // Assert that the message was sent and received correctly
                expect(message.username).toBe('testUser');
                expect(message.text).toBe('Hello from User1!');
                resolve();
            });
        });

        await Promise.all([previousMessagesPromise, sendMessagePromise]);
    });

});

