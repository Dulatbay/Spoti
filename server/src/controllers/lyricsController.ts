import {Request, Response} from "express";
import axios from "axios";

const getLyrics = async (req: Request, res: Response): Promise<void> => {
    const { artist, title } = req.query;
    console.log(artist);
    if (!artist || !title) {
        res.status(400).json({ error: 'Artist and title are required' });
        return
    }

    try {
        const response = await axios.get(`https://api.lyrics.ovh/v1/${artist}/${title}`);
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch lyrics' });
    }
}

export {getLyrics};