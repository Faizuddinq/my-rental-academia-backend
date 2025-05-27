import { Router } from 'express';
import { FavoriteController } from '../controllers/favorite.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();
const favoriteController = new FavoriteController();

/**
 * @swagger
 * /api/favorites:
 *   get:
 *     tags: [Favorites]
 *     summary: Get user's favorite properties
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of favorite properties
 *       401:
 *         description: Unauthorized
 */
router.get('/', protect, favoriteController.getFavorites);

/**
 * @swagger
 * /api/favorites/{propertyId}:
 *   post:
 *     tags: [Favorites]
 *     summary: Add property to favorites
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Property added to favorites
 *       400:
 *         description: Property already in favorites
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Property not found
 */
router.post('/:propertyId', protect, favoriteController.addToFavorites);

/**
 * @swagger
 * /api/favorites/{propertyId}:
 *   delete:
 *     tags: [Favorites]
 *     summary: Remove property from favorites
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Property removed from favorites
 *       400:
 *         description: Property not in favorites
 *       401:
 *         description: Unauthorized
 */
router.delete('/:propertyId', protect, favoriteController.removeFromFavorites);

/**
 * @swagger
 * /api/favorites/{propertyId}/status:
 *   get:
 *     tags: [Favorites]
 *     summary: Check if a property is in user's favorites
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Favorite status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     isFavorite:
 *                       type: boolean
 *       401:
 *         description: Unauthorized
 */
router.get('/:propertyId/status', protect, favoriteController.checkFavoriteStatus);

export default router;
