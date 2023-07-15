import mongoose from "mongoose";

const booksSchema = new mongoose.Schema(
  {
    title: { type: String },
    author: { type: String },
    genre: { type: String },
    publishedDate: { type: Date },
    description: { type: String },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);
const BooksModel = mongoose.model("Books", booksSchema);

module.exports = BooksModel;
