import express from "express";
import spotifyRouter from "./routes/spotifyRouter";
import cors from "cors";
import {getLyrics} from "./controllers/lyricsController";
import axios from "axios";

require('dotenv').config();
const app = express();
const port = 3000;

app.use(cors());

app.use('/api/spotify', spotifyRouter);
app.use('/api/lyrics', getLyrics);

const NEWS_API_KEY = '6b29d81fe7844657afe47877f0e1551b';

// Endpoint to fetch music-related news
app.get('/api/music-news', async (req, res) => {
    const { page = 1, pageSize = 20 } = req.query; // Default page is 1 and pageSize is 5

    try {
        const response = await axios.get('https://newsapi.org/v2/everything', {
            params: {
                q: 'music',
                apiKey: NEWS_API_KEY,
                language: 'en',
                sortBy: 'publishedAt',
                pageSize,
                page, // Use page from query parameters
            },
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).json({ error: 'Failed to fetch news' });
    }
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});




app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
