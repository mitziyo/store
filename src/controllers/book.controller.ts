import { Request, Response } from "express";
import Errors, { HttpCode, Message } from "../libs/Error";
import { T } from "../libs/types/common";
import BookService from "../models/Book.service";
import { BookInput } from "../libs/types/book";
import { AdminRequest, ExtendedRequest } from "../libs/types/member";
import { BookInquiry } from "../libs/types/book";
import { BookGenre } from "../libs/enums/book.enum";

const bookService = new BookService();

const bookController: T = {};

/** SPA */
bookController.getBooks = async (req: Request, res: Response) => {
  try {
    console.log("getBooks");
    const { page, limit, order, bookGenre, search, priceMin, priceMax } = req.query;
    const inquiry: BookInquiry = {
      order: order ? String(order) : "createdAt", // berilmasa, yangi qo'shilganlar birinchi
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 8,
    };
    if (bookGenre) inquiry.bookGenre = bookGenre as BookGenre;
    if (search) inquiry.search = String(search);
    if (priceMin) inquiry.priceMin = Number(priceMin);
    if (priceMax) inquiry.priceMax = Number(priceMax);

    const result = await bookService.getBooks(inquiry);
    res.status(HttpCode.OK).json(result);
  } catch (err) {
    console.log("Error, getBooks:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

bookController.getBook = async (req: ExtendedRequest, res: Response) => {
  try {
    console.log("getBook");
    const { id } = req.params as { id: string };
    const memberId = req.member?._id ?? null;
    const result = await bookService.getBook(memberId, id);
    res.status(HttpCode.OK).json(result);
  } catch (err) {
    console.log("Error, getBook:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

/** SSR */
bookController.getAllBooks = async (req: Request, res: Response) => {
  try {
    console.log("getAllBooks");
    const data = await bookService.getAllBooks();
    res.render("books", { books: data });
  } catch (err) {
    console.log("Error, getAllBooks:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard); // aniqlanmagan xatoni ham standart javob bilan qoplaydi
  }
};

bookController.createNewBook = async (req: AdminRequest, res: Response) => {
  try {
    console.log("createNewBook");
    console.log("req.files:", req.files);
    if (!req.files?.length)
      throw new Errors(HttpCode.INTERNAL_SERVER_ERROR, Message.CREATE_FAILED);

    const data: BookInput = req.body;
    data.bookImages = req.files.map((ele) => ele.path.replace(/\\/g, "/")); // Windows'da multer "\" bilan qaytaradi, URL uchun "/" kerak
    await bookService.createNewBook(data);
    res.send(
      `<script> alert("Successful creation!"); window.location.replace('/admin/book/all') </script>`,
    );
  } catch (err) {
    console.log("Error, createNewBook:", err);
    const message =
      err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
    res.send(
      `<script> alert("${message}"); window.location.replace('/admin/book/all') </script>`,
    );
  }
};

bookController.updatedChosenBook = async (req: Request, res: Response) => {
  try {
    console.log("updatedChosenBook");
    const id = req.params.id as string;
    const result = await bookService.updatedChosenBook(id, req.body);

    res.status(HttpCode.OK).json({ data: result });
  } catch (err) {
    console.log("Error, updatedChosenBook:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

export default bookController;
