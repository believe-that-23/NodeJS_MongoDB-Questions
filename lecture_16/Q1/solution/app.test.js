import mongoose from 'mongoose';
import BookRepository from './src/features/books/book.repository.js';
import { connectUsingMongoose } from './src/config/mongooseConfig.js';
import { bookSchema } from './src/features/books/book.schema.js';
import { reviewSchema } from './src/features/books/review.schema.js';

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

    describe('reviewSchema', () => {
        it('should validate a valid review object', async () => {
            const reviewData = {
                text: 'This book is amazing!',
                rating: 5,
                book: new mongoose.Types.ObjectId(), // Provide a valid book ObjectId
            };

            const Review = mongoose.model('Review', reviewSchema);

            // Insert a sample review into the test database
            const review = await new Review(reviewData).save();

            expect(review).toBeDefined();
            expect(review.text).toBe(reviewData.text);
            expect(review.rating).toBe(reviewData.rating);
            expect(review.book).toEqual(reviewData.book);
        });
    });
        describe('addReviewToBook', () => {
            it('should add a review to a book', async () => {
                const bookData = {
                    title: 'Sample Book',
                    author: 'author1',
                    genre: 'Fiction',
                    copies: 5,
                    availableCopies: 5,
                    reviews: [], // Initialize with no reviews
                };

                const Book = mongoose.model('Book', bookSchema);

                // Insert a sample book into the test database
                const book = await new Book(bookData).save();

                const repository = new BookRepository();

                // Add a review to the book
                const reviewText = 'This book is amazing!';
                const reviewRating = 5;
                const addedReview = await repository.addReviewToBook(book._id, reviewText, reviewRating);

                // Retrieve the book with the added review
                const updatedBook = await Book.findById(book._id).populate('reviews');

                expect(addedReview.text).toBe(reviewText);
                expect(addedReview.rating).toBe(reviewRating);
                expect(updatedBook.reviews).toHaveLength(1);
            });
        });
    });

