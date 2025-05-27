import { config } from 'dotenv';
import app from './app';
import { connectDB } from './config/database';
import { logger } from './utils/logger';
import { importPropertiesFromCSV } from './utils/importProperties';
import path from 'path';

// Load environment variables
config();

const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB()
  .then(async () => {
    // Import properties from CSV if IMPORT_CSV environment variable is set
    if (process.env.IMPORT_CSV === 'true') {
      try {
        const csvPath = path.join(__dirname, '..', 'data', 'properties.csv');
        await importPropertiesFromCSV(csvPath);
        logger.info('Properties imported successfully');
      } catch (error) {
        logger.error('Error importing properties:', error);
      }
    }

    // Start the server
    app.listen(PORT, () => {
     
      logger.info(`[Server]: Server running on port ${PORT}`);
      logger.info(` API Documentation: http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((error) => {
    logger.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  });

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  logger.error('Unhandled Rejection:', error);
  process.exit(1);
});
