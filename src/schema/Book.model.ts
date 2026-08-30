// Start 2
import mongoose, { Schema } from "mongoose";
import { BookFormat, BookGenre, BookStatus } from "../libs/enums/book.enum";

const bookSchema = new Schema(
  {
    bookStatus: {
      type: String,
      enum: BookStatus,
      default: BookStatus.PAUSE,
    },

    bookGenre: {
      type: String,
      enum: BookGenre,
      required: true,
    },

    bookName: {
      type: String,
      required: true,
    },

    bookPrice: {
      type: Number,
      required: true,
    },

    bookLeftCount: {
      type: Number,
      required: true,
    },

    bookFormat: {
      type: String,
      enum: BookFormat,
      default: BookFormat.PAPERBACK,
    },

    bookDesc: {
      type: String,
      required: true,
    },

    bookImages: {
      type: [String], // massiv bo'lgani uchun nomi ko'plikda (burak'da "productImage" birlikda edi — xato)
      default: [],
    },

    bookViews: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

bookSchema.index({ bookName: 1, bookFormat: 1 }, { unique: true }); // productVolume yo'q, shuning uchun indexdan ham chiqarib tashlandi

export default mongoose.model("Book", bookSchema);
// End 2
