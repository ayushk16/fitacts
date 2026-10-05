import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import { initializeDatabase } from './db/initDb.js';
import { router as signupRoutes } from './routes/signUpRoute.js';
import { router as loginRoutes } from './routes/loginRoute.js';
import { router as activitiesRoutes } from './routes/activitiesRoute.js';
import { router as userRoutes } from './routes/userRoute.js';
import { router as eventRoutes } from './routes/eventRoute.js';
import { router as swaggerRoutes } from './routes/swaggerRoute.js';
import { router as testRoutes } from './routes/testRoute.js';
import errorHandler from './midlewares/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 3000;
const corsOptions = {
  origin: '*',
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get('/', (req, res) => {
  res.json({
    data: {
      message: 'FitActs API is running with Drizzle ORM',
    },
    message: 'connected',
  });
});

app.use('/docs', swaggerRoutes);
app.use('/signup', signupRoutes);
app.use('/login', loginRoutes);
app.use('/user', userRoutes);
app.use('/activities', activitiesRoutes);
app.use('/events', eventRoutes);
app.use('/test', testRoutes);

app.all('*', (req, res, next) => {
  const error = new Error(`Can't find ${req.originalUrl} on the server.`);
  error.status = 'wrong url';
  error.statusCode = 404;
  next(error);
});

app.use(errorHandler);

// Auto-initialize DB and start server
initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`FitActs server listening on http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to initialize database on startup:', err);
  app.listen(PORT, () => {
    console.log(`FitActs server listening on http://localhost:${PORT} (without db init)`);
  });
});