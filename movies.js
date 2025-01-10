const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json()); 
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

const moviesSchema = new mongoose.Schema({
    moviecode: { type: String },
    title: { type: String },
    director: { type: String },
    releaseYear: { type: Number },
    genre: { type: String },
});


const Movie = mongoose.model('Movie', moviesSchema);


app.post('/movie', async (req, res) => {
    try {
        const { moviecode, title, director, releaseYear, genre } = req.body;

        const movie = new Movie({ moviecode, title, director, releaseYear, genre });
        await movie.save();

        res.status(201).json(movie);
    } catch (error) {
        console.error('Error saving movie:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.put('/movie/:moviecode', async (req, res) => {
    const { moviecode } = req.params;
    const { title, director, releaseYear, genre } = req.body;

    try {
        
        const updatedMovie = await Movie.findOneAndUpdate(
            { moviecode },
            { title, director, releaseYear, genre },
            { new: true } 
        );

      
        res.status(200).json(updatedMovie);
    } catch (error) {
        console.error('Error updating movie:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.delete('/movie/:moviecode', async (req, res) => {
    const { moviecode } = req.params;

    try {
        const movie = await Movie.findOneAndDelete({ moviecode });
        res.status(200).json({ message: 'Movie deleted successfully', movie });
    } catch (error) {
        console.error('Error deleting movie:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Start the Server
app.listen(PORT, () => {
    console.log(`Server Running at http://localhost:${PORT}`);
});
