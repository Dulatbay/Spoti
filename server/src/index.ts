import express from "express";
import spotifyRouter from "./routes/spotifyRouter";
import cors from "cors";
import axios from "axios";

require('dotenv').config();
const app = express();
const port = 3000;

app.use(cors());

app.use('/api/spotify', spotifyRouter);


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
