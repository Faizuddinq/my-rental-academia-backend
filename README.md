# MyRentalAcademia API Backend

A modern, scalable Node.js + TypeScript backend system for managing property listings with advanced features like property recommendations, favorites management, and intelligent search filtering.

## Features

### Core Features
- **Secure Authentication**
  - JWT-based authentication
  - Password hashing and security
  - Protected routes and middleware

- **Property Management**
  - Complete CRUD operations
  - Rich property metadata
  - Multiple property types support
  - Location-based listings

- **Advanced Filtering**
  - Price range filtering
  - Location-based search
  - Amenities filtering
  - Property type filtering
  - Bedroom/bathroom count filters
  - Furnished status filter

- **User Features**
  - Favorite properties management
  - Property recommendations
  - User profiles

### Technical Features
- **Data Management**
  - MongoDB integration with Mongoose
  - Redis caching for performance
  - Input validation using Zod
  - TypeScript for type safety

- **Developer Experience**
  - Swagger API documentation
  - Environment configuration
  - Error handling middleware
  - Logging system
  - TypeScript decorators

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Caching**: Redis
- **Authentication**: JWT
- **Validation**: Zod
- **Documentation**: Swagger

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- Redis (v6 or higher)
- npm or yarn

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hypergro-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   Update the following variables in `.env`:
   ```
   # MongoDB Configuration
   MONGODB_URI=your_mongodb_uri

   # Redis Configuration
   REDIS_HOST=localhost
   REDIS_PORT=6379
   REDIS_PASSWORD=your_redis_password
   REDIS_ENABLED=true

   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=7d

   # Cors Configuration
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Start MongoDB and Redis**
   - Ensure MongoDB is running
   - Start Redis server if enabled

5. **Run Development Server**
   ```bash
   npm run dev
   ```
   Server will start at `http://localhost:5015`

## API Testing with Postman

1. **Import Collection**
   - Open Postman
   - Import `postman/HyperGro API Tests.postman_collection.json`
   - Import `postman/HyperGro Local.postman_environment.json`

2. **Setup Environment**
   - Select "HyperGro Local" environment
   - Verify `BASE_URL` is set to `http://localhost:5015/api`

3. **Testing Flow**
   1. **Authentication**
      - Run "Register User" request (skip if already registered)
      - Run "Login User" request (automatically sets AUTH_TOKEN)

   2. **Properties**
      - Create Property (automatically sets PROPERTY_ID)
      - Get All Properties (supports multiple filters)
      - Get Property by ID
      - Update Property
      - Delete Property

   3. **Favorites**
      - Add to Favorites
      - Get Favorites
      - Remove from Favorites

   4. **Recommendations**
      - Recommend Property
      - Get Recommendations
      - Get Recommendation Stats

### API Filtering Examples

Properties can be filtered using query parameters:
```
GET /api/properties?
  page=1&
  limit=10&
  location.state=Maharashtra&
  priceMin=100000&
  priceMax=500000&
  bedrooms=3&
  furnished=true&
  amenities=parking,gym,security
```

## Error Handling

The API uses standard HTTP status codes and returns errors in the format:
```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE"
  }
}
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
