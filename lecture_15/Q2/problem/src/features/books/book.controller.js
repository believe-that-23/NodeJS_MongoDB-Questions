import mongoose from 'mongoose';
import BookRepository from "./book.repository.js";

export default class BookController {
    constructor() {
        this.bookRepository = new BookRepository();
    }

    //------change code in below functions only--------
    createBook = async (req, res) => { }

    getOne = async (req, res) => { }

}
