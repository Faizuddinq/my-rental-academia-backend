import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { ILoginRequest, IRegisterRequest } from '../interfaces/user.interface';
import { ValidationError } from '../utils/errors';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  public register = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userData: IRegisterRequest = req.body;

      // Validate required fields
      if (!userData.email || !userData.password || !userData.name) {
        throw new ValidationError('Please provide all required fields');
      }

      // Validate email format
      await this.authService.validateEmail(userData.email);

      const result = await this.authService.register(userData);

      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  public login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const loginData: ILoginRequest = req.body;

      // Validate required fields
      if (!loginData.email || !loginData.password) {
        throw new ValidationError('Please provide email and password');
      }

      const result = await this.authService.login(loginData);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}
