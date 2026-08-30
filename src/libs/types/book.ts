import mongoose from "mongoose"; // burak "ObjectId"ni to'g'ridan-to'g'ri import qiladi, lekin mongoose@9'da bu turlar mos kelmaydi — Member.ts'dagi kabi mongoose.Types.ObjectId ishlatiladi
import { BookFormat, BookGenre, BookStatus } from "../enums/book.enum";

export interface Book {
  _id: mongoose.Types.ObjectId;
  bookStatus: BookStatus;
  bookGenre: BookGenre;
  bookName: string;
  bookPrice: number;
  bookLeftCount: number;
  bookFormat: BookFormat;
  bookDesc?: string;
  bookImages: string[];
  bookViews: number;
}

export interface BookInput {
  bookStatus?: BookStatus;
  bookGenre: BookGenre;
  bookName: string;
  bookPrice: number;
  bookLeftCount: number;
  bookFormat?: BookFormat;
  bookDesc?: string;
  bookImages?: string[];
  bookViews?: number;
}

export interface BookUpdateInput {
  _id: mongoose.Types.ObjectId;
  bookStatus?: BookStatus;
  bookGenre?: BookGenre;
  bookName?: string;
  bookPrice?: number;
  bookLeftCount?: number;
  bookFormat?: BookFormat;
  bookDesc?: string;
  bookImages?: string[];
  bookViews?: number;
}
