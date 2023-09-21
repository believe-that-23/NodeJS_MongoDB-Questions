import mongoose from 'mongoose';
import request from 'supertest';
import app from './index.js';
import BookRepository from './src/features/books/book.repository.js';
import { connectUsingMongoose } from './src/config/mongooseConfig.js';

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

  describe('POST api/books', () => {
    it('should create a new book', async () => {
      const newBookData = {
        title: 'Sample Book',
        author: 'Sample Author', 
        genre: 'Fiction',
        copies: 5,
        availableCopies: 5,
      };

      const response = await request(app)
        .post('/api/books')
        .send(newBookData)
        .expect(201);

      expect(response.body).toMatchObject(newBookData);
    });
  });

  describe('GET api/books/:bookId', () => {
    it('should retrieve a book by ID', async () => {
      const bookData = {
        title: 'Sample Book',
        author: '123456789012345678901234',
        genre: 'Fiction',
        copies: 5,
        availableCopies: 5,
      };

      const book = await new BookRepository().createBook(bookData);

      const response = await request(app)
        .get(`/api/books/${book._id}`)
        .expect(200);

      expect(response.body).toMatchObject(bookData);
    });

    it('should return 404 if book ID does not exist', async () => {
      const nonExistentBookId = new mongoose.Types.ObjectId(); // Replace with a non-existent ID
      console.log(nonExistentBookId);

      await request(app)
        .get(`/api/books/${nonExistentBookId}`)
        .expect(404);
    });
  });
});


