import mongoose from 'mongoose';
import BookRepository from './src/features/books/book.repository.js';
import app from './index.js';
import { connectUsingMongoose } from './src/config/mongooseConfig.js';
import { bookSchema } from './src/features/books/book.schema.js';
import { authorSchema } from './src/features/books/author.schema.js';

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

    describe('authorSchema', () => {
        it('should validate a valid author object', async () => {
            const authorData = {
                name: 'Author Name',
                books: [], // Initialize with no books
            };

            const Author = mongoose.model('Author', authorSchema);

            // Insert a sample author into the test database
            const author = await new Author(authorData).save();

            expect(author).toBeDefined();
            expect(author.name).toBe(authorData.name);
            expect(author.books).toHaveLength(0);
        });
    });

    describe('bookSchema', () => {
        it('should validate a valid book object', async () => {
            const bookData = {
                title: 'Sample Book',
                authors: [],
                genre: 'Fiction',
                copies: 5,
                availableCopies: 5,
                reviews: [],
            };

            const Book = mongoose.model('Book', bookSchema);

            // Insert a sample book into the test database
            const book = await new Book(bookData).save();

            expect(book).toBeDefined();
            expect(book.title).toBe(bookData.title);
            expect(book.genre).toBe(bookData.genre);
            expect(book.copies).toBe(bookData.copies);
            expect(book.availableCopies).toBe(bookData.availableCopies);
            expect(book.reviews).toHaveLength(0);
        });
    });

    describe('addAuthorToBook', () => {
        it('should associate an author with a book', async () => {
            const bookData = {
                title: 'Sample Book',
                author: 'author1',
                genre: 'Fiction',
                copies: 5,
                availableCopies: 5,
                reviews: [],
            };

            const authorData = {
                name: 'Author Name',
                books: [],
            };

            const Book = mongoose.model('Book', bookSchema);
            const Author = mongoose.model('Author', authorSchema);

            // Insert sample book and author into the test database
            const book = await new Book(bookData).save();
            const author = await new Author(authorData).save();

            const repository = new BookRepository();

            // Associate the author with the book
            await repository.addAuthorToBook(book._id, author._id);

            // Retrieve the book and author with the association
            const updatedBook = await Book.findById(book._id).populate('authors');
            const updatedAuthor = await Author.findById(author._id).populate('books');

            expect(updatedBook.authors).toHaveLength(1);
            expect(updatedAuthor.books).toHaveLength(1);
        });
    });

    describe('listAuthorsByBook', () => {
        it('should list authors of a book', async () => {
            const bookData = {
                title: 'Sample Book',
                author: 'author1',
                genre: 'Fiction',
                copies: 5,
                availableCopies: 5,
                reviews: [],
            };

            const authorData = {
                name: 'Author Name',
                books: [],
            };

            const Book = mongoose.model('Book', bookSchema);
            const Author = mongoose.model('Author', authorSchema);

            // Insert sample book and author into the test database
            const book = await new Book(bookData).save();
            const author = await new Author(authorData).save();

            const repository = new BookRepository();

            // Associate the author with the book
            await repository.addAuthorToBook(book._id, author._id);

            // List authors of the book
            const authorsOfBook = await repository.listAuthorsByBook(book._id);

            expect(authorsOfBook).toHaveLength(1);
            expect(authorsOfBook[0].name).toBe(authorData.name);
        });
    });

    describe('listBooksByAuthor', () => {
        it('should list books by an author', async () => {
            const bookData1 = {
                title: 'Book 1',
                author: 'Author 1',
                genre: 'Fiction',
                copies: 5,
                availableCopies: 5,
                reviews: [],
            };

            const bookData2 = {
                title: 'Book 2',
                author: 'Author 1',
                genre: 'Non-Fiction',
                copies: 3,
                availableCopies: 3,
                reviews: [],
            };

            const authorData = {
                name: 'Author Name',
                books: [],
            };

            const Book = mongoose.model('Book', bookSchema);
            const Author = mongoose.model('Author', authorSchema);

            // Insert sample books and author into the test database
            const book1 = await new Book(bookData1).save();
            const book2 = await new Book(bookData2).save();
            const author = await new Author(authorData).save();

            const repository = new BookRepository();

            // Associate the author with the books
            await repository.addAuthorToBook(book1._id, author._id);
            await repository.addAuthorToBook(book2._id, author._id);

            // List books by the author
            const booksByAuthor = await repository.listBooksByAuthor(author._id);

            expect(booksByAuthor).toHaveLength(2);
            expect(booksByAuthor[0].title).toBe(bookData1.title);
            expect(booksByAuthor[1].title).toBe(bookData2.title);
        });
    });
});

