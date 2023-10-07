import mongoose from 'mongoose';
import {messageModel as Message} from './message.schema.js';
import { connectToDatabase } from './db.config.js';

describe('Message Model', () => {
    beforeAll(async () => {
        // Connect to a test MongoDB database (you can use an in-memory database)
        connectToDatabase();
    });

    afterAll(async () => {
        // Close the Mongoose connection after tests are done
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        // Clear the 'messages' collection before each test
        await Message.deleteMany({});
    });

    it('should save a message to the database', async () => {
        // Create a new message
        const newMessage = new Message({
            username: 'testUser',
            text: 'Hello, world!',
            room: 'testRoom',
        });

        // Save the message to the database
        await newMessage.save();

        // Retrieve the saved message from the database
        const savedMessage = await Message.findOne({
            username: 'testUser',
            text: 'Hello, world!',
            room: 'testRoom',
        });

        // Assert that the saved message exists
        expect(savedMessage).toBeDefined();
        expect(savedMessage.username).toBe('testUser');
        expect(savedMessage.text).toBe('Hello, world!');
        expect(savedMessage.room).toBe('testRoom');
        expect(savedMessage.timestamp).toBeInstanceOf(Date);
    });
});
