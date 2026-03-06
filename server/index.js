import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import aiRoutes from './ai/routes.js';

const PORT = Number(process.env.PORT) || 3001;
const frontendOrigins = (process.env.FRONTEND_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const app = express();

app.use(
  cors({
    origin: frontendOrigins,
  }),
);
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'miri-api' });
});

app.use('/api/ai', aiRoutes);

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
