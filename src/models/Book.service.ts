import mongoose from "mongoose";
import Errors, { HttpCode, Message } from "../libs/Error";
import { Book, BookInput, BookInquiry, BookUpdateInput } from "../libs/types/book";
import BookModel from "../schema/Book.model";
import { shapeIntoMongooseObjectId } from "../libs/config";
import { BookStatus } from "../libs/enums/book.enum";
import { T } from "../libs/types/common";
import ViewService from "./View.service";
import { ViewGroup } from "../libs/enums/view.enum";
import { ViewInput } from "../libs/types/view";

class BookService {
  private readonly bookModel;
  public viewService;

  constructor() {
    this.bookModel = BookModel;
    this.viewService = new ViewService();
  }

  /** SPA */
  public async getBooks(inquiry: BookInquiry): Promise<Book[]> {
    const match: T = { bookStatus: BookStatus.PROCESS };

    if (inquiry.bookGenre) match.bookGenre = inquiry.bookGenre;
    if (inquiry.search) {
      match.bookName = { $regex: new RegExp(inquiry.search, "i") };
    }

    const sort: T =
      inquiry.order === "bookPrice" ? { [inquiry.order]: 1 } : { [inquiry.order]: -1 };

    const result = await this.bookModel
      .aggregate([
        { $match: match },
        { $sort: sort },
        { $skip: (inquiry.page - 1) * inquiry.limit },
        { $limit: inquiry.limit },
      ])
      .exec();

    return result as unknown as Book[];
  }

  public async getBook(memberId: mongoose.Types.ObjectId | null, id: string): Promise<Book> {
    const bookId = shapeIntoMongooseObjectId(id);
    let result = await this.bookModel
      .findOne({ _id: bookId, bookStatus: BookStatus.PROCESS })
      .exec();
    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

    if (memberId) {
      const input: ViewInput = {
        memberId: memberId,
        viewRefId: bookId,
        viewGroup: ViewGroup.BOOK,
      };
      const existView = await this.viewService.checkViewExistence(input);

      if (!existView) {
        await this.viewService.insertMemberView(input);

        result = await this.bookModel
          .findByIdAndUpdate(bookId, { $inc: { bookViews: 1 } }, { returnDocument: "after" })
          .exec();
      }
    }

    return result as unknown as Book;
  }

  /** SSR */
  public async getAllBooks(): Promise<Book[]> {
    const result = await this.bookModel.find().exec();
    return result as unknown as Book[]; // bo'sh ro'yxat ham to'g'ri holat, xato emas — shuning uchun bo'sh-tekshiruv yo'q
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

