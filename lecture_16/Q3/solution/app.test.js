import mongoose from 'mongoose';
import BookRepository from './src/features/books/book.repository.js';
import app from './index.js';
import { connectUsingMongoose } from './src/config/mongooseConfig.js';
import { bookSchema } from './src/features/books/book.schema.js';
import { authorSchema } from './src/features/books/author.schema.js';
import BookController from './src/features/books/book.controller.js';

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

    describe('addReviewToTarget', () => {
        it('should add a review to the target (Author) and update the target entity', async () => {
            const authorData = {
                name: 'Author Name',
                books: [],
            };

            const Author = mongoose.model('Author', authorSchema);
            const author = await new Author(authorData).save();

            const reviewText = 'This is a great author!';
            const reviewRating = 5;

            const repository = new BookRepository();

            // Add a review to the author
            const savedReview = await repository.addReviewToTarget(author._id, 'Author', reviewText, reviewRating);

            // Retrieve the author with the review
            const updatedAuthor = await Author.findById(author._id).populate('reviews');

            expect(savedReview).toBeDefined();
            expect(savedReview.text).toBe(reviewText);
            expect(savedReview.rating).toBe(reviewRating);
            expect(updatedAuthor.reviews).toHaveLength(1);
            expect(updatedAuthor.reviews[0]._id).toEqual(savedReview._id);
        });

        it('should add a review to the target (Book) and update the target entity', async () => {
            const bookData = {
                title: 'Sample Book',
                authors: [],
                genre: 'Fiction',
                copies: 5,
                availableCopies: 5,
                reviews: [],
            };

            const Book = mongoose.model('Book', bookSchema);
            const book = await new Book(bookData).save();

            const reviewText = 'This is a great book!';
            const reviewRating = 4;

            const repository = new BookRepository();

            // Add a review to the book
            const savedReview = await repository.addReviewToTarget(book._id, 'Book', reviewText, reviewRating);

            // Retrieve the book with the review
            const updatedBook = await Book.findById(book._id).populate('reviews');

            expect(savedReview).toBeDefined();
            expect(savedReview.text).toBe(reviewText);
            expect(savedReview.rating).toBe(reviewRating);
            expect(updatedBook.reviews).toHaveLength(1);
            expect(updatedBook.reviews[0]._id).toEqual(savedReview._id);
        });

        it('should handle an error and return a 500 response', async () => {
            const targetId = new mongoose.Types.ObjectId();
            const target = 'Author';
            const text = 'This is a great author!';
            const rating = 5;

            const error = new Error('Author not found');

            // Mock the request and response objects
            const req = {
                params: {
                    targetId,
                    target,
                },
                body: {
                    text,
                    rating,
                },
            };

            const res = {
                status: jest.fn().mockReturnThis(), // Mock the 'status' function to return itself
                json: jest.fn(),
            };

            // Mock the repository function to throw an error
            const repositoryMock = {
                addReviewToTarget: jest.fn().mockRejectedValue(error),
            };

            const controller = new BookController(repositoryMock);

            await controller.addReview(req, res);

            // Expect the status to be set to 500 and 'json' to be called with the error message
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Failed to add review' });
        });


        it('should handle an error and return a 500 response', async () => {
            const nonExistentBookId = new mongoose.Types.ObjectId();
            const target = 'Book';
            const text = 'This is a great book!';
            const rating = 4;
        
            const error = new Error('Book not found');
        
            // Mock the request and response objects
            const req = {
                params: {
                    targetId: nonExistentBookId,
                    target,
                },
                body: {
                    text,
                    rating,
                },
            };
        
            const res = {
                status: jest.fn().mockReturnThis(), // Mock the 'status' function to return itself
                json: jest.fn(),
            };
        
            // Mock the repository function to throw an error
            const repositoryMock = {
                addReviewToTarget: jest.fn().mockRejectedValue(error),
            };
        
            const controller = new BookController(repositoryMock);
        
            await controller.addReview(req, res);
        
            // Expect the status to be set to 500 and 'json' to be called with the error message
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Failed to add review' });
        });
        
    });
});

