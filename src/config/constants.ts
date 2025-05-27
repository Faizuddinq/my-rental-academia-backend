export const constants = {
 
  JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret_key',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',

 
  REDIS_CACHE_EXPIRATION: 3600, // seconds

  
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 50,

  
  MIN_PRICE: 0,
  MAX_PRICE: Number.MAX_SAFE_INTEGER,
  MIN_BEDROOMS: 0,
  MAX_BEDROOMS: 10,


  ERRORS: {
    AUTH: {
      INVALID_CREDENTIALS: 'Invalid email or password',
      UNAUTHORIZED: 'Unauthorized access',
      TOKEN_EXPIRED: 'Token has expired',
      TOKEN_INVALID: 'Invalid token',
    },
    PROPERTY: {
      NOT_FOUND: 'Property not found',
      UNAUTHORIZED: 'Not authorized to perform this action',
      INVALID_ID: 'Invalid property ID',
    },
    USER: {
      NOT_FOUND: 'User not found',
      EMAIL_EXISTS: 'Email already exists',
      INVALID_EMAIL: 'Invalid email format',
    },
  },
};
