const BooksModel = require("../models/books");

export const getBookById = async (_id: any) =>
  await BooksModel.findOne({ _id }).then((book: any) => book.toObject());

export const createBooks = (values: Record<string, any>) =>
  new BooksModel(values).save().then((book: any) => book.toObject());

export const updateBook = (_id: any, values: Record<string, any>) =>
  BooksModel.findByIdAndUpdate(_id, values, {
    new: true,
  });

export const deleteBook = (_id: any) => BooksModel.findByIdAndDelete({ _id });
