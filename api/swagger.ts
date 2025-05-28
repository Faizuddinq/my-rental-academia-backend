import { swaggerSpec } from '../src/utils/swagger';
import swaggerUi from 'swagger-ui-express';
import express from 'express';

const router = express.Router();


router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "MyRentalAcademia API Documentation",
  customfavIcon: "/favicon.ico"
}));

export default router; 