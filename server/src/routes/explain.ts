import { Router, Request, Response } from 'express';
import OpenAI from 'openai';

const router = Router();
require('dotenv').config()

console.log('OpenAI API Key:', process.env.OPENAI_API_KEY);
console.log(process.env);

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});


router.post('/explain-lyric', async (req: Request, res: Response) => {
    const { full_lyrics, selected_line } = req.body;

    if (!full_lyrics || !selected_line) {
        res.status(400).json({ error: 'Need full_lyrics and selected_line' });
        return;
    }

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                {
                    role: 'user',
                    content: `
Полный текст песни:
${full_lyrics}

Объясни смысл строки:
"${selected_line}"
`,
                },
            ],
        });

        res.json({ explanation: response.choices[0].message?.content });
    } catch (error) {
        console.error('Error communicating with OpenAI:', error);
        res.status(500).json({ error: 'Failed to get explanation from OpenAI' });
    }
});

export default router;
