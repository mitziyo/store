// Start 3
import Errors, { HttpCode, Message } from "../libs/Error";
import { Book, BookInput } from "../libs/types/book";
import BookModel from "../schema/Book.model";

class BookService {
  private readonly bookModel;

  constructor() {
    this.bookModel = BookModel;
  }

  public async createNewBook(input: BookInput): Promise<Book> {
    try {
      const result = await this.bookModel.create(input);
      return result as unknown as Book; // Member.service.ts'dagi kabi: Mongoose'ning hydrated-document turi bilan oddiy interfeys mos kelmaydi
    } catch (err) {
      console.error("Error, model:createNewBook:", err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }
}

export default BookService;
// End 3

