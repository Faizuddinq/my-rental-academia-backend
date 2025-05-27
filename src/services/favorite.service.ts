import mongoose from 'mongoose';
import { User } from '../models/User';
import { Property } from '../models/Property';
import { NotFoundError, ValidationError } from '../utils/errors';
import { getCachedData, setCachedData, deleteCachedData } from '../utils/redis.util';
import { constants } from '../config/constants';

export class FavoriteService {
  private generateCacheKey(userId: string): string {
    return `favorites:${userId}`;
  }

  public async getFavorites(userId: string) {
    const cacheKey = this.generateCacheKey(userId);
    const cachedFavorites = await getCachedData(cacheKey);

    if (cachedFavorites) {
      return cachedFavorites;
    }

    const user = await User.findById(userId).populate('favorites');
    if (!user) {
      throw new NotFoundError('User not found');
    }

    await setCachedData(cacheKey, user.favorites, constants.REDIS_CACHE_EXPIRATION);
    return user.favorites;
  }

  public async addToFavorites(userId: string, propertyId: string) {
    const propertyObjectId = new mongoose.Types.ObjectId(propertyId);
    // Check if property exists
    const property = await Property.findById(propertyObjectId);
    if (!property) {
      throw new NotFoundError('Property not found');
    }

    // Add to favorites if not already added
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (user.favorites.some(id => id.toString() === propertyId)) {
      throw new ValidationError('Property already in favorites');
    }

    user.favorites.push(propertyObjectId);
    await user.save();

    // Invalidate cache
    await deleteCachedData(this.generateCacheKey(userId));

    return property;
  }

  public async removeFromFavorites(userId: string, propertyId: string) {
    const propertyObjectId = new mongoose.Types.ObjectId(propertyId);
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const favoriteIndex = user.favorites.findIndex(id => id.toString() === propertyId);
    if (favoriteIndex === -1) {
      throw new ValidationError('Property not in favorites');
    }

    user.favorites.splice(favoriteIndex, 1);
    await user.save();

    // Invalidate cache
    await deleteCachedData(this.generateCacheKey(userId));

    return { success: true };
  }

  public async checkFavoriteStatus(userId: string, propertyId: string): Promise<boolean> {
    const propertyObjectId = new mongoose.Types.ObjectId(propertyId);
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user.favorites.some(id => id.toString() === propertyId);
  }
}
