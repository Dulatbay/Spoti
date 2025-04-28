// src/routes/spotifyRoutes.ts
import { Router } from 'express';
import { searchSpotify } from '../controllers/spotifyController';

const router = Router();

router.get('/search', searchSpotify); // Route to handle search query

export default router;
