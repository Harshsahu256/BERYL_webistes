import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

// Modular Route Handlers
import authRoutes from './server/routes/authRoutes';
import categoryRoutes from './server/routes/categoryRoutes';
import subcategoryRoutes from './server/routes/subcategoryRoutes';
import pdfRoutes from './server/routes/pdfRoutes';
import contentRoutes from './server/routes/contentRoutes';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // High payload body parser for PDF uploads up to 100MB
  app.use(express.json({ limit: '100mb' }));
  app.use(express.urlencoded({ limit: '100mb', extended: true }));

  // ====================================================
  // REST API MODULES
  // ====================================================
  app.use('/api/admin', authRoutes);
  app.use('/api/categories', categoryRoutes);
  app.use('/api/subcategories', subcategoryRoutes);
  app.use('/api/pdfs', pdfRoutes);
  app.use('/api', contentRoutes);

  // ====================================================
  // VITE DEV MIDDLEWARE & PRODUCTION SPA FALLBACK
  // ====================================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Beryl Drugs Full-Stack Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
