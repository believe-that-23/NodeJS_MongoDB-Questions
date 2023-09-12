import mongoose from 'mongoose';
import { bookSchema } from './book.schema.js'

// creating model from schema.
const booksModel = mongoose.model('Book', bookSchema);


export default class BookRepository {


    // -----Change code in below functions only-----

    async createBook(bookData) {}

    async getOne(id) {}
}