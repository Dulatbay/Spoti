// src/routes/spotifyRoutes.ts
import { Router } from 'express';
import { searchSpotify,proxySpotify } from '../controllers/spotifyController';

const router = Router();

router.get('/search', searchSpotify); // Route to handle search query
router.get('/proxy', proxySpotify); // Route to handle search query

export default router;
