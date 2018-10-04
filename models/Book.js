const mongoose = require("mongoose")

const bookSchema = new mongoose.Schema({
  book_title: { type: String, required: true },
  comments: [String],
  created_on: { type: Date, default: new Date().getTime() },
})

const Book = mongoose.model("Book", bookSchema, "books")

module.exports = Book