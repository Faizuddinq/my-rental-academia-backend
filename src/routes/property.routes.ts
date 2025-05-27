import { Router } from 'express';
import { PropertyController } from '../controllers/property.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();
const propertyController = new PropertyController();

/**
 * @swagger
 * /api/properties:
 *   get:
 *     tags: [Properties]
 *     summary: Get all properties with filters and pagination
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Number of items per page
 *       - in: query
 *         name: location.state
 *         schema:
 *           type: string
 *       - in: query
 *         name: location.city
 *         schema:
 *           type: string
 *       - in: query
 *         name: priceMin
 *         schema:
 *           type: number
 *       - in: query
 *         name: priceMax
 *         schema:
 *           type: number
 *       - in: query
 *         name: bedrooms
 *         schema:
 *           type: integer
 *       - in: query
 *         name: furnished
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: List of properties
 */
router.get('/', propertyController.getProperties);

/**
 * @swagger
 * /api/properties/{id}:
 *   get:
 *     tags: [Properties]
 *     summary: Get property by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Property details
 *       404:
 *         description: Property not found
 */
router.get('/:id', propertyController.getPropertyById);

/**
 * @swagger
 * /api/properties:
 *   post:
 *     tags: [Properties]
 *     summary: Create a new property
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PropertyCreate'
 *     responses:
 *       201:
 *         description: Property created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/', protect, propertyController.createProperty);

/**
 * @swagger
 * /api/properties/{id}:
 *   put:
 *     tags: [Properties]
 *     summary: Update a property
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PropertyCreate'
 *     responses:
 *       200:
 *         description: Property updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Property not found
 */
router.put('/:id', protect, propertyController.updateProperty);

/**
 * @swagger
 * /api/properties/{id}:
 *   delete:
 *     tags: [Properties]
 *     summary: Delete a property
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Property deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Property not found
 */
router.delete('/:id', protect, propertyController.deleteProperty);

export default router;
