import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { constants } from '../config/constants';
import { UnauthorizedError } from '../utils/errors';
import { User } from '../models/User';
import { IUserRequest } from '../interfaces/user.interface';

interface JwtPayload {
  id: string;
}

export const protect = async (
  req: IUserRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new UnauthorizedError('Not authorized to access this route');
    }

    // Verify token
    const decoded = jwt.verify(token, constants.JWT_SECRET) as JwtPayload;

    // Get user from token
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new UnauthorizedError('Invalid token'));
    } else if (error instanceof jwt.TokenExpiredError) {
      next(new UnauthorizedError('Token expired'));
    } else {
      next(error);
    }
  }
};
