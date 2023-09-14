import mongoose from 'mongoose';
import { bookSchema } from './src/features/books/book.schema.js';
import { connectUsingMongoose } from './src/config/mongooseConfig.js';


describe('Mongoose Database Connection', () => {
    it('should connect to the MongoDB database', async () => {

        // Mock mongoose.connect to resolve immediately
        jest.spyOn(mongoose, 'connect').mockResolvedValueOnce();

        // Mock console.log
        const mockedConsoleLog = jest.spyOn(console, 'log');
        // Mock mongoose.connect to resolve immediately
        mongoose.connect.mockResolvedValueOnce();

        // Call the connectUsingMongoose function
        await connectUsingMongoose();

        // Check if mongoose.connect was called with the correct arguments
        expect(mongoose.connect).toHaveBeenCalledWith(
            expect.stringMatching(/(localhost|127\.0\.0\.1):27017/),//localhost:27017 or 127.0.0.1:27017',
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        );

        // Check if the connection message was logged
        expect(mockedConsoleLog).toHaveBeenCalledWith(expect.stringMatching(/\S+/));
    });
});


describe('Book Schema Validation', () => {
    it('should have the correct fields', () => {
        // Instead of using the imported bookSchema, directly access it from mongoose
        const schema = bookSchema;

        expect(schema.path('title')).toBeDefined();
        expect(schema.path('title').instance).toBe('String');
        expect(schema.path('title').isRequired).toBe(true);

        expect(schema.path('author')).toBeDefined();
        expect(schema.path('author').instance).toBe('ObjectId');
        expect(schema.path('author').options.ref).toBe('Author');
        expect(schema.path('author').isRequired).toBe(true);

        expect(schema.path('genre')).toBeDefined();
        expect(schema.path('genre').instance).toBe('String');
        expect(schema.path('genre').isRequired).toBe(true);
        const genreEnum = schema.path('genre').enumValues;
        expect(genreEnum.length).toBeGreaterThan(0);
        expect(genreEnum).not.toContain('');



        expect(schema.path('copies')).toBeDefined();
        expect(schema.path('copies').instance).toBe('Number');
        expect(schema.path('copies').isRequired).toBe(true);
        expect(schema.path('copies').options.min).toBe(1);

        expect(schema.path('availableCopies')).toBeDefined();
        expect(schema.path('availableCopies').instance).toBe('Number');
        expect(schema.path('availableCopies').isRequired).toBe(true);
        expect(schema.path('availableCopies').options.min).toBe(0);
    });
});
