import swaggerJsdoc from 'swagger-jsdoc';

const isProduction = process.env.NODE_ENV === 'production';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MyRentalAcademia API Documentation',
      version: '1.0.0',
      description: 'API documentation for MyRentalAcademia: A modern, scalable Node.js + TypeScript backend system for managing property listings with advanced features like property recommendations, favorites management, and intelligent search filtering.',
    },
    servers: [
      {
        url: isProduction
          ? 'https://my-rental-academia-backend.vercel.app'
          : `http://localhost:${process.env.PORT || 3000}`,
        description: isProduction ? 'Production server' : 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
