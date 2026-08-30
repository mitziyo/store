import BookModel from "../schema/Book.model";

class BookService {
  private readonly bookModel;

  constructor() {
    this.bookModel = BookModel;
  }
}

export default BookService;
