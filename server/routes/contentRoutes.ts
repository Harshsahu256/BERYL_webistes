import { Router, Request, Response } from 'express';
import { HERO_SLIDES, INITIAL_NEWS_ITEMS } from '../../src/data/companyData';

const router = Router();

// GET /api/health
router.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// GET /api/slides
router.get('/slides', (req: Request, res: Response) => {
  res.json({ success: true, slides: HERO_SLIDES });
});

// GET /api/news
router.get('/news', (req: Request, res: Response) => {
  res.json({ success: true, news: INITIAL_NEWS_ITEMS });
});

export default router;
