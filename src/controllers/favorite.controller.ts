import { Response, NextFunction } from 'express';
import { FavoriteService } from '../services/favorite.service';
import { IUserRequest } from '../interfaces/user.interface';
import { ValidationError } from '../utils/errors';

export class FavoriteController {
  private favoriteService: FavoriteService;

  constructor() {
    this.favoriteService = new FavoriteService();
  }

  public getFavorites = async (
    req: IUserRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new ValidationError('User not authenticated');
      }

      const favorites = await this.favoriteService.getFavorites(req.user._id);

      res.status(200).json({
        success: true,
        data: favorites
      });
    } catch (error) {
      next(error);
    }
  };

  public addToFavorites = async (
    req: IUserRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new ValidationError('User not authenticated');
      }

      const property = await this.favoriteService.addToFavorites(
        req.user._id,
        req.params.propertyId
      );

      res.status(200).json({
        success: true,
        data: property
      });
    } catch (error) {
      next(error);
    }
  };

  public removeFromFavorites = async (
    req: IUserRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new ValidationError('User not authenticated');
      }

      await this.favoriteService.removeFromFavorites(
        req.user._id,
        req.params.propertyId
      );

      res.status(200).json({
        success: true,
        data: null
      });
    } catch (error) {
      next(error);
    }
  };

  public checkFavoriteStatus = async (
    req: IUserRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new ValidationError('User not authenticated');
      }

      const isFavorite = await this.favoriteService.checkFavoriteStatus(
        req.user._id,
        req.params.propertyId
      );

      res.status(200).json({
        success: true,
        data: { isFavorite }
      });
    } catch (error) {
      next(error);
    }
  };
}
