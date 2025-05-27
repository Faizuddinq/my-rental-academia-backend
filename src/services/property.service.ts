import { FilterQuery } from 'mongoose';
import { Property, IProperty } from '../models/Property';
import { NotFoundError, ValidationError } from '../utils/errors';
import { PropertyFilter, PropertyCreate, PaginationOptions, PaginatedResponse } from '../interfaces/property.interface';
import { getCachedData, setCachedData, deleteCachedData } from '../utils/redis.util';
import { constants } from '../config/constants';

export class PropertyService {
  private generateCacheKey(filters: PropertyFilter, pagination: PaginationOptions): string {
    return `properties:${JSON.stringify(filters)}:${JSON.stringify(pagination)}`;
  }

  private buildFilterQuery(filters: PropertyFilter): FilterQuery<IProperty> {
    const query: FilterQuery<IProperty> = {};

    if (filters.location) {
      if (filters.location.state) {
        query['location.state'] = filters.location.state;
      }
      if (filters.location.city) {
        query['location.city'] = filters.location.city;
      }
    }

    if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
      query.price = {};
      if (filters.priceMin !== undefined) {
        query.price.$gte = filters.priceMin;
      }
      if (filters.priceMax !== undefined) {
        query.price.$lte = filters.priceMax;
      }
    }

    if (filters.bedrooms !== undefined) {
      query.bedrooms = filters.bedrooms;
    }

    if (filters.furnished !== undefined) {
      query.furnished = filters.furnished;
    }

    if (filters.propertyType) {
      query.propertyType = filters.propertyType;
    }

    if (filters.amenities && filters.amenities.length > 0) {
      query.amenities = { $all: filters.amenities };
    }

    if (filters.tags && filters.tags.length > 0) {
      query.tags = { $all: filters.tags };
    }

    return query;
  }

  public async getProperties(
    filters: PropertyFilter,
    pagination: PaginationOptions
  ): Promise<PaginatedResponse<IProperty>> {
    const cacheKey = this.generateCacheKey(filters, pagination);
    const cachedResult = await getCachedData<PaginatedResponse<IProperty>>(cacheKey);

    if (cachedResult) {
      return cachedResult;
    }

    const query = this.buildFilterQuery(filters);
    const skip = (pagination.page - 1) * pagination.limit;
    const sortOptions: { [key: string]: 'asc' | 'desc' } = {};
    
    if (pagination.sortBy) {
      sortOptions[pagination.sortBy] = pagination.sortOrder || 'asc';
    }

    const [properties, total] = await Promise.all([
      Property.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(pagination.limit)
        .exec(),
      Property.countDocuments(query)
    ]);

    const result: PaginatedResponse<IProperty> = {
      data: properties,
      pagination: {
        total,
        page: pagination.page,
        limit: pagination.limit,
        pages: Math.ceil(total / pagination.limit)
      }
    };

    await setCachedData(cacheKey, result, constants.REDIS_CACHE_EXPIRATION);
    return result;
  }

  public async getPropertyById(id: string): Promise<IProperty> {
    const cacheKey = `property:${id}`;
    const cachedProperty = await getCachedData<IProperty>(cacheKey);

    if (cachedProperty) {
      return cachedProperty;
    }

    const property = await Property.findById(id);
    if (!property) {
      throw new NotFoundError('Property not found');
    }

    await setCachedData(cacheKey, property, constants.REDIS_CACHE_EXPIRATION);
    return property;
  }

  private async generatePropertyId(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    
    // Find the latest property for the current month
    const latestProperty = await Property.findOne(
      { propertyId: new RegExp(`^PROP-${year}${month}-`) },
      { propertyId: 1 },
      { sort: { propertyId: -1 } }
    );

    let sequence = 1;
    if (latestProperty) {
      const lastSequence = parseInt(latestProperty.propertyId.split('-')[2]);
      sequence = lastSequence + 1;
    }

    return `PROP-${year}${month}-${String(sequence).padStart(3, '0')}`;
  }

  public async createProperty(propertyData: PropertyCreate, userId: string): Promise<IProperty> {
    const propertyId = await this.generatePropertyId();
    
    const property = await Property.create({
      ...propertyData,
      propertyId,
      createdBy: userId
    });

    // Invalidate list cache
    await deleteCachedData('properties:*');
    return property;
  }

  public async updateProperty(
    id: string,
    propertyData: Partial<PropertyCreate>,
    userId: string
  ): Promise<IProperty> {
    const property = await Property.findById(id);
    if (!property) {
      throw new NotFoundError('Property not found');
    }

    console.log('Debug - Property Update Authorization:', {
      requestUserId: userId,
      propertyCreatedById: property.createdBy,
      propertyCreatedByIdString: property.createdBy?.toString(),
      doTheyMatch: property.createdBy?.toString() === userId
    });

    // Compare the string representations of both IDs
    const creatorId = property.createdBy?.toString();
    const requesterId = userId?.toString();
    
    if (!creatorId || creatorId !== requesterId) {
      throw new ValidationError('Not authorized to update this property');
    }

    const updatedProperty = await Property.findByIdAndUpdate(
      id,
      { $set: propertyData },
      { new: true, runValidators: true }
    );

    if (!updatedProperty) {
      throw new NotFoundError('Property not found');
    }

    // Invalidate caches
    await Promise.all([
      deleteCachedData(`property:${id}`),
      deleteCachedData('properties:*')
    ]);

    return updatedProperty;
  }

  public async deleteProperty(id: string, userId: string): Promise<void> {
    const property = await Property.findById(id);
    if (!property) {
      throw new NotFoundError('Property not found');
    }

    // Compare the string representations of both IDs
    const creatorId = property.createdBy?.toString();
    const requesterId = userId?.toString();
    
    if (!creatorId || creatorId !== requesterId) {
      throw new ValidationError('Not authorized to delete this property');
    }

    await Property.findByIdAndDelete(id);

    // Invalidate caches
    await Promise.all([
      deleteCachedData(`property:${id}`),
      deleteCachedData('properties:*')
    ]);
  }
}
