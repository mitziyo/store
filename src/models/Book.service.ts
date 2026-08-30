import Errors, { HttpCode, Message } from "../libs/Error";
import { Book, BookInput, BookUpdateInput } from "../libs/types/book";
import BookModel from "../schema/Book.model";
import { shapeIntoMongooseObjectId } from "../libs/config";

class BookService {
  private readonly bookModel;

  constructor() {
    this.bookModel = BookModel;
  }

  // Start 1
  public async getAllBooks(): Promise<Book[]> {
    const result = await this.bookModel.find().exec();
    return result as unknown as Book[]; // bo'sh ro'yxat ham to'g'ri holat, xato emas — shuning uchun bo'sh-tekshiruv yo'q
  }
  // End 1

  public async createNewBook(input: BookInput): Promise<Book> {
    try {
      const result = await this.bookModel.create(input);
      return result as unknown as Book; // Member.service.ts'dagi kabi: Mongoose'ning hydrated-document turi bilan oddiy interfeys mos kelmaydi
    } catch (err) {
      console.error("Error, model:createNewBook:", err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }

  public async updatedChosenBook(
    id: string,
    input: BookUpdateInput,
  ): Promise<Book> {
    const objectId = shapeIntoMongooseObjectId(id);
    const result = await this.bookModel
      .findOneAndUpdate({ _id: objectId }, input, { returnDocument: "after" }) // mongoose@9'da { new: true } eskirgan
      .exec();
    if (!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);
    return result as unknown as Book;
  }
}

export default BookService;

