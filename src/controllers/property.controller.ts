import { Request, Response, NextFunction } from 'express';
import { PropertyService } from '../services/property.service';
import { PropertyFilterSchema, PropertyCreateSchema } from '../interfaces/property.interface';
import { IUserRequest } from '../interfaces/user.interface';
import { ValidationError } from '../utils/errors';
import { constants } from '../config/constants';

export class PropertyController {
  private propertyService: PropertyService;

  constructor() {
    this.propertyService = new PropertyService();
  }

  public getProperties = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Parse and validate filters
      const filters = PropertyFilterSchema.parse(req.query);

      // Parse pagination options
      const page = Math.max(1, Number(req.query.page) || 1);
      const limit = Math.min(
        Number(req.query.limit) || constants.DEFAULT_PAGE_SIZE,
        constants.MAX_PAGE_SIZE
      );
      const sortBy = req.query.sortBy as string;
      const sortOrder = req.query.sortOrder as 'asc' | 'desc';

      const result = await this.propertyService.getProperties(
        filters,
        { page, limit, sortBy, sortOrder }
      );

      res.status(200).json({
        success: true,
        ...result
      });
    } catch (error) {
      next(error);
    }
  };

  public getPropertyById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const property = await this.propertyService.getPropertyById(req.params.id);

      res.status(200).json({
        success: true,
        data: property
      });
    } catch (error) {
      next(error);
    }
  };

  public createProperty = async (
    req: IUserRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new ValidationError('User not authenticated');
      }

      const propertyData = PropertyCreateSchema.parse(req.body);
      const property = await this.propertyService.createProperty(
        propertyData,
        req.user._id
      );

      res.status(201).json({
        success: true,
        data: property
      });
    } catch (error) {
      next(error);
    }
  };

  public updateProperty = async (
    req: IUserRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new ValidationError('User not authenticated');
      }

      const propertyData = PropertyCreateSchema.partial().parse(req.body);
      const property = await this.propertyService.updateProperty(
        req.params.id,
        propertyData,
        req.user._id
      );

      res.status(200).json({
        success: true,
        data: property
      });
    } catch (error) {
      next(error);
    }
  };

  public deleteProperty = async (
    req: IUserRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new ValidationError('User not authenticated');
      }

      await this.propertyService.deleteProperty(req.params.id, req.user._id);

      res.status(200).json({
        success: true,
        data: null
      });
    } catch (error) {
      next(error);
    }
  };
}
