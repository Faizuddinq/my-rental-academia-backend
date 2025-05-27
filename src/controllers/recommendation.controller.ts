import { Request, Response, NextFunction } from 'express';
import { RecommendationService } from '../services/recommendation.service';
import { IUserRequest } from '../interfaces/user.interface';
import { ValidationError } from '../utils/errors';

export class RecommendationController {
  private recommendationService: RecommendationService;

  constructor() {
    this.recommendationService = new RecommendationService();
  }

  public getRecommendations = async (
    req: IUserRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new ValidationError('User not authenticated');
      }

      const recommendations = await this.recommendationService.getRecommendations(req.user._id);

      res.status(200).json({
        success: true,
        data: recommendations
      });
    } catch (error) {
      next(error);
    }
  };

  public recommendProperty = async (
    req: IUserRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new ValidationError('User not authenticated');
      }

      const { email } = req.body;
      if (!email) {
        throw new ValidationError('Recipient email is required');
      }

      const result = await this.recommendationService.recommendProperty(
        req.user._id,
        email,
        req.params.propertyId
      );

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  public getRecommendedProperties = async (
    req: IUserRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new ValidationError('User not authenticated');
      }

      const properties = await this.recommendationService.getRecommendedProperties(req.user._id);

      res.status(200).json({
        success: true,
        data: properties
      });
    } catch (error) {
      next(error);
    }
  };

  public getRecommendationStats = async (
    req: IUserRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new ValidationError('User not authenticated');
      }

      const stats = await this.recommendationService.getRecommendationStats(req.user._id);

      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  };
}
