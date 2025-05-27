import mongoose from 'mongoose';
import { User } from '../models/User';
import { Property } from '../models/Property';
import { NotFoundError, ValidationError } from '../utils/errors';
import { getCachedData, setCachedData, deleteCachedData } from '../utils/redis.util';
import { constants } from '../config/constants';

export class RecommendationService {
  private generateCacheKey(userId: string): string {
    return `recommendations:${userId}`;
  }

  public async getRecommendations(userId: string) {
    const cacheKey = this.generateCacheKey(userId);
    const cachedRecommendations = await getCachedData(cacheKey);

    if (cachedRecommendations) {
      return cachedRecommendations;
    }

    const user = await User.findById(userId)
      .populate({
        path: 'recommendationsReceived',
        populate: [
          { path: 'from', select: 'name email' },
          { path: 'propertyId' }
        ]
      });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    await setCachedData(cacheKey, user.recommendationsReceived, constants.REDIS_CACHE_EXPIRATION);
    return user.recommendationsReceived;
  }

  public async recommendProperty(
    fromUserId: string,
    toUserEmail: string,
    propertyId: string
  ) {
    // Check if property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      throw new NotFoundError('Property not found');
    }

    // Find recipient user by email
    const toUser = await User.findOne({ email: toUserEmail });
    if (!toUser) {
      throw new NotFoundError('Recipient user not found');
    }

    // Check if property is already recommended to this user
    // Ensure consistent string comparison for ObjectIds
    const existingRecommendation = toUser.recommendationsReceived.find(rec => {
      const recPropertyId = rec.propertyId?.toString();
      const recFromUserId = rec.from?.toString();
      return recPropertyId === propertyId && recFromUserId === fromUserId;
    });

    if (existingRecommendation) {
      throw new ValidationError('Property already recommended to this user');
    }

    // Add recommendation
    toUser.recommendationsReceived.push({
      from: new mongoose.Types.ObjectId(fromUserId),
      propertyId: new mongoose.Types.ObjectId(propertyId),
      date: new Date()
    });

    await toUser.save();

    // Invalidate cache
    await deleteCachedData(this.generateCacheKey(toUser._id));

    return {
      success: true,
      message: 'Property recommended successfully'
    };
  }

  public async getRecommendedProperties(userId: string) {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const recommendations = await Property.find({
      _id: { 
        $in: user.recommendationsReceived.map(rec => rec.propertyId)
      }
    });

    return recommendations;
  }

  public async getRecommendationStats(userId: string) {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const stats = {
      totalRecommendations: user.recommendationsReceived.length,
      recommendationsByUser: {} as { [key: string]: number }
    };

    // Count recommendations by user
    user.recommendationsReceived.forEach(rec => {
      const fromUserId = rec.from.toString();
      stats.recommendationsByUser[fromUserId] = (stats.recommendationsByUser[fromUserId] || 0) + 1;
    });

    return stats;
  }
}
