import { Request, Response } from "express";
import Errors from "../libs/Error";
import { T } from "../libs/types/common";
import BookService from "../models/Book.service";

const bookService = new BookService();

const bookController: T = {};
bookController.getAllBooks = async (req: Request, res: Response) => {
  try {
    console.log("getAllBooks");
    res.render("books");
  } catch (err) {
    console.log("Error, getAllBooks:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard); // aniqlanmagan xatoni ham standart javob bilan qoplaydi
  }
};

bookController.createNewBook = async (req: Request, res: Response) => {
  try {
    console.log("createNewBook");
  } catch (err) {
    console.log("Error, createNewBook:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

bookController.updatedChosenBook = async (req: Request, res: Response) => {
  try {
    console.log("updatedChosenBook");
  } catch (err) {
    console.log("Error, updatedChosenBook:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

export default bookController;
