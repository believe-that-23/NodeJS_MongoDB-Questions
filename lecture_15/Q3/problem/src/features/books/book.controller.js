//-----------pre-written code starts----------
import BookRepository from "./book.repository.js";


export default class BookController {
    constructor() {
        this.bookRepository = new BookRepository();
    }

    createBook = async (req, res) => {

        const { title, author, genre, copies, availableCopies } = req.body;
        try {
            const bookData = {
                title,
                author,
                genre,
                copies,
                availableCopies
            };
            await this.bookRepository.createBook(bookData)
            res.status(201).json(bookData);
        } catch (err) {
            console.log(err);
            res.status(500).json({ error: 'Failed to create a new book' });
        }

    }

    getOne = async (req, res) => {
        const { bookId } = req.params;
        console.log(bookId);

        try {
            const book = await this.bookRepository.getOne(bookId);
            if (!book) {
                res.status(404).send("book  not found.");
            } else {
                res.status(200).send(book);
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({ error: 'Failed to find book' });
        }
    }

    //---------------pre-written code ends-----------------

    // Complete the functions below:
    
    listBookByGenre = async (req, res) => { }

    updateBookAvailability = async (req, res) => { }

    deleteBook = async (req, res) => { }

}
