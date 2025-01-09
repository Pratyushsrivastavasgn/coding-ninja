const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // Use built-in middleware to parse JSON requests

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

// Schema Definition
const bookSchema = new mongoose.Schema({
    bookId: { type: String, required: true },
    title: { type: String, required: true },
    authorName: { type: String },
    numOfPages: { type: Number },
    language: { type: String },
});

// Model
const Book = mongoose.model('Book', bookSchema);

// Routes
app.post('/book', async (req, res) => {
    try {
        const { bookId, title, authorName, numOfPages, language } = req.body;
        const book = new Book({ bookId, title, authorName, numOfPages, language });
        await book.save();
        res.status(201).json(book);
    } catch (error) {
        res.status(400).send(error.message);
        console.error('Error saving book:', error);
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server Running at ${PORT}`);
});
