import { Router } from 'express';
import authRoutes from './auth.routes';
import propertyRoutes from './property.routes';
import favoriteRoutes from './favorite.routes';
import recommendationRoutes from './recommendation.routes';

const router = Router();

// Health check route
router.get('/health', (_, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is healthy',
    timestamp: new Date().toISOString()
  });
});

// API routes
router.use('/auth', authRoutes);
router.use('/properties', propertyRoutes);
router.use('/favorites', favoriteRoutes);
router.use('/recommendations', recommendationRoutes);

export default router;
