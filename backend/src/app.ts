import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import { serveStatic } from '@hono/node-server/serve-static'
import { adminRoutes, authRoutes, studentRoutes } from '@/routes'

const app = new Hono();

app.use('*', logger());
app.use('*', cors({
  origin: process.env.FRONTEND_URL!.split(','),
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}))

app.use('/uploads/*', serveStatic({ root: './src/storage'}))

app.get('/health', (c) => c.text('✅ Backend is running!'));
app.route('/', authRoutes)
app.route('/', studentRoutes)
app.route('/admin', adminRoutes)

export default app;