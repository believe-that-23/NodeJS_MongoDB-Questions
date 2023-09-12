import mongoose from 'mongoose';
import BookRepository from './src/features/books/book.repository.js';
import { connectUsingMongoose } from './src/config/mongooseConfig.js';
import { bookSchema } from './src/features/books/book.schema.js';

describe('Book API Endpoints', () => {
    beforeAll(async () => {
        // Connect to a test database before running tests
        await connectUsingMongoose();
    });

    afterAll(async () => {
        // Disconnect from the test database after running tests
        await mongoose.disconnect();
    });

    beforeEach(async () => {
        // Clear the test database and reset any data
        await mongoose.connection.db.dropDatabase();
    });

    describe('listBooksByGenre', () => {
        it('should return books by genre', async () => {
            const booksData = [
                {
                    title: 'Book 1',
                    author: 'author1',
                    genre: 'Fiction',
                    copies: 5,
                    availableCopies: 5,
                },
                {
                    title: 'Book 2',
                    author: 'author2',
                    genre: 'Non-Fiction',
                    copies: 3,
                    availableCopies: 3,
                },
                {
                    title: 'Book 3',
                    author: 'author3',
                    genre: 'Fiction',
                    copies: 4,
                    availableCopies: 4,
                },
            ];

            // Insert sample books into the test database
            await mongoose.model('Book', bookSchema).insertMany(booksData);

            const repository = new BookRepository();

            const fictionBooks = await repository.listBooksByGenre('Fiction');
            const nonFictionBooks = await repository.listBooksByGenre('Non-Fiction');

            expect(fictionBooks).toHaveLength(2);
            expect(nonFictionBooks).toHaveLength(1);
        });
    });

    describe('updateBookAvailability', () => {
        it('should update availableCopies of a book', async () => {
            const bookData = {
                title: 'Sample Book',
                author: 'author1',
                genre: 'Fiction',
                copies: 5,
                availableCopies: 5,
            };

            const Book = mongoose.model('Book', bookSchema);

            // Insert a sample book into the test database
            const book = await new Book(bookData).save();

            const repository = new BookRepository();

            // Update the availableCopies
            const updatedBook = await repository.updateBookAvailability(book._id, -2);

            expect(updatedBook.availableCopies).toBe(3);
        });
    });

    describe('deleteBookById', () => {
        it('should delete a book by ID', async () => {
            const bookData = {
                title: 'Sample Book',
                author: 'author1',
                genre: 'Fiction',
                copies: 5,
                availableCopies: 5,
            };

            const Book = mongoose.model('Book', bookSchema);

            // Insert a sample book into the test database
            const book = await new Book(bookData).save();

            const repository = new BookRepository();

            // Delete the book by ID
            const deletedBook = await repository.deleteBookById(book._id);

            // Check if the book is deleted
            const bookInDatabase = await Book.findById(book._id);

            expect(deletedBook._id).toEqual(book._id);
            expect(bookInDatabase).toBeNull();
        });
    });
});

