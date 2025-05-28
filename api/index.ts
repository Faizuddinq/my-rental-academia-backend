import app from '../src/app';
import swaggerRouter from './swagger';

//  Swagger UI at /api-docs
app.use('/api-docs', swaggerRouter);

export default app;
