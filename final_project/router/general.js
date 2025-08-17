const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user (placeholder)
public_users.post("/register", (req, res) => {
    return res.status(300).json({ message: "Yet to be implemented" });
});

// Get the book list available in the shop using Promises
public_users.get('/', (req, res) => {
    new Promise((resolve, reject) => {
        if (books) resolve(books);
        else reject("No books found");
    })
    .then(bookList => res.status(200).json(bookList))
    .catch(err => res.status(500).json({ message: "Error fetching books", error: err }));
});

// Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;

    new Promise((resolve, reject) => {
        if (books[isbn]) resolve(books[isbn]);
        else reject("Book not found");
    })
    .then(bookDetails => res.status(200).json(bookDetails))
    .catch(err => res.status(404).json({ message: err }));
});

// Get book details based on author using Promises
public_users.get('/author/:author', (req, res) => {
    const author = req.params.author;

    new Promise((resolve, reject) => {
        const results = Object.values(books).filter(book => book.author.toLowerCase() === author.toLowerCase());
        if (results.length > 0) resolve(results);
        else reject("No books found for this author");
    })
    .then(bookList => res.status(200).json(bookList))
    .catch(err => res.status(404).json({ message: err }));
});

// Get book details based on title using Promises
public_users.get('/title/:title', (req, res) => {
    const title = req.params.title.toLowerCase();

    new Promise((resolve, reject) => {
        const result = Object.values(books).find(book => book.title.toLowerCase() === title);
        if (result) resolve(result);
        else reject("Book not found with this title");
    })
    .then(bookDetails => res.status(200).json(bookDetails))
    .catch(err => res.status(404).json({ message: err }));
});

// Get book review (synchronous)
public_users.get('/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;

    if (books[isbn]) {
        if (books[isbn].reviews) {
            return res.status(200).json({ reviews: books[isbn].reviews });
        } else {
            return res.status(200).json({ message: "No reviews available for this book" });
        }
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

module.exports.general = public_users;
