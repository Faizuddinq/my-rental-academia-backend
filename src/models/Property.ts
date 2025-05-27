import mongoose, { Document, Schema } from 'mongoose';

export interface IProperty extends Document {
  propertyId: string;
  title: string;
  propertyType: string;
  price: number;
  location: {
    state: string;
    city: string;
  };
  area: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  furnished: boolean;
  availableFrom: Date;
  listedBy: string;
  tags: string[];
  colorTheme: string;
  rating: number;
  isVerified: boolean;
  listingType: string;
  createdAt: Date;
  createdBy?: mongoose.Types.ObjectId;
}

const propertySchema = new Schema<IProperty>({
  propertyId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  propertyType: { type: String, required: true },
  price: { type: Number, required: true },
  location: {
    state: { type: String, required: true },
    city: { type: String, required: true }
  },
  area: { type: Number, required: true },
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  amenities: [{ type: String }],
  furnished: { type: Boolean, default: false },
  availableFrom: { type: Date, required: true },
  listedBy: { type: String, required: true },
  tags: [{ type: String }],
  colorTheme: { type: String },
  rating: { type: Number, min: 0, max: 5 },
  isVerified: { type: Boolean, default: false },
  listingType: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true
});

// Create indexes for frequently queried fields
propertySchema.index({ propertyId: 1 });
propertySchema.index({ 'location.state': 1, 'location.city': 1 });
propertySchema.index({ price: 1 });
propertySchema.index({ propertyType: 1 });
propertySchema.index({ bedrooms: 1 });
propertySchema.index({ furnished: 1 });

export const Property = mongoose.model<IProperty>('Property', propertySchema);
