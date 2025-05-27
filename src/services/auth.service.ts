import jwt from 'jsonwebtoken';
import { constants } from '../config/constants';
import { User } from '../models/User';
import { ConflictError, UnauthorizedError, ValidationError } from '../utils/errors';
import { ILoginRequest, IRegisterRequest, IAuthResponse } from '../interfaces/user.interface';

export class AuthService {
  private generateToken(userId: string): string {
    return jwt.sign(
      { id: userId },
      constants.JWT_SECRET,
      { expiresIn: constants.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] }
    );
  }

  public async register(userData: IRegisterRequest): Promise<IAuthResponse> {
    const { email, password, name } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ConflictError('User already exists with this email');
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
    });

    const token = this.generateToken(user._id);

    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    };
  }

  public async login(loginData: ILoginRequest): Promise<IAuthResponse> {
    const { email, password } = loginData;

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const token = this.generateToken(user._id);

    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    };
  }

  public async validateEmail(email: string): Promise<void> {
    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    if (!emailRegex.test(email)) {
      throw new ValidationError('Invalid email format');
    }
  }
}
