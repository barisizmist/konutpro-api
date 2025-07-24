import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { initDB } from './config/db.js';
import transactionsRouter from './router/transactionsRouter.js';
import usersRouter from './router/usersRouter.js';
import projectsRouter from './router/projectsRouter.js';
import applicationsRouter from './router/applicationsRouter.js';
import rateLimitter from './middleware/rateLimitter.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Enable CORS for all routes
app.use(
  cors({
    origin: ['http://localhost:5001', 'http://localhost:5173', 'http://localhost:5174', 'http://192.168.1.104:5173', 'http://192.168.1.104:5173/'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    preflightContinue: false,
    optionsSuccessStatus: 204
  })
);
// app.use(rateLimitter);
app.use(express.json());

app.use('/api/users', usersRouter);
app.use('/api/transactions', transactionsRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/applications', applicationsRouter);

initDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch(error => {
    console.error('Error starting server:', error);
    process.exit(1);
  });
