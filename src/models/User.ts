import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { ValidationError } from '../utils/errors';

export interface IRecommendation {
  from: mongoose.Types.ObjectId;
  propertyId: mongoose.Types.ObjectId;
  date: Date;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  favorites: mongoose.Types.ObjectId[];
  recommendationsReceived: IRecommendation[];
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
      'Please enter a valid email address'
    ]
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false // Don't include password in queries by default
  },
  favorites: [{
    type: Schema.Types.ObjectId,
    ref: 'Property'
  }],
  recommendationsReceived: [{
    from: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    propertyId: {
      type: Schema.Types.ObjectId,
      ref: 'Property',
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Create indexes
userSchema.index({ email: 1 });
userSchema.index({ 'recommendationsReceived.propertyId': 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(new ValidationError('Error hashing password'));
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new ValidationError('Error comparing passwords');
  }
};

export const User = mongoose.model<IUser>('User', userSchema);
