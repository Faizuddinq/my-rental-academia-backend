import express, { Express } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { config } from 'dotenv';
import routes from './routes';
import { errorHandler } from './middleware/error.middleware';
import { swaggerSpec } from './utils/swagger';
import { logger } from './utils/logger';

// Load environment variables
config();

const app: Express = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});


// Root route
app.get('/', (req, res) => {
  res.send('Welcome to MyRentalAcademia');
});

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API Routes
app.use('/api', routes);

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

export default app;
