import { Router } from 'express';
import { RecommendationController } from '../controllers/recommendation.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();
const recommendationController = new RecommendationController();

/**
 * @swagger
 * /api/recommendations:
 *   get:
 *     tags: [Recommendations]
 *     summary: Get user's received recommendations
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of received recommendations
 *       401:
 *         description: Unauthorized
 */
router.get('/', protect, recommendationController.getRecommendations);

/**
 * @swagger
 * /api/recommendations/properties:
 *   get:
 *     tags: [Recommendations]
 *     summary: Get all properties recommended to the user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of recommended properties
 *       401:
 *         description: Unauthorized
 */
router.get('/properties', protect, recommendationController.getRecommendedProperties);

/**
 * @swagger
 * /api/recommendations/stats:
 *   get:
 *     tags: [Recommendations]
 *     summary: Get user's recommendation statistics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Recommendation statistics
 *       401:
 *         description: Unauthorized
 */
router.get('/stats', protect, recommendationController.getRecommendationStats);

/**
 * @swagger
 * /api/recommendations/{propertyId}:
 *   post:
 *     tags: [Recommendations]
 *     summary: Recommend a property to another user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Property recommended successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Property or recipient not found
 */
router.post('/:propertyId', protect, recommendationController.recommendProperty);

export default router;
