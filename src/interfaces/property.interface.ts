import { z } from 'zod';

export const PropertyFilterSchema = z.object({
  location: z.object({
    state: z.string().optional(),
    city: z.string().optional(),
  }).optional(),
  priceMin: z.string()
    .transform((val) => (val ? Number(val) : undefined))
    .pipe(z.number().min(0).optional())
    .optional(),
  priceMax: z.string()
    .transform((val) => (val ? Number(val) : undefined))
    .pipe(z.number().min(0).optional())
    .optional(),
  bedrooms: z.string()
    .transform((val) => (val ? Number(val) : undefined))
    .pipe(z.number().min(0).optional())
    .optional(),
  furnished: z.string()
    .transform((val) => val === 'true')
    .pipe(z.boolean())
    .optional(),
  propertyType: z.string().optional(),
  amenities: z.string()
    .transform((val) => (val ? val.split(',') : []))
    .pipe(z.array(z.string()))
    .optional(),
  tags: z.string()
    .transform((val) => (val ? val.split(',') : []))
    .pipe(z.array(z.string()))
    .optional(),
});

export type PropertyFilter = z.infer<typeof PropertyFilterSchema>;

export const PropertyCreateSchema = z.object({
  title: z.string().min(3).max(100),
  propertyType: z.string(),
  price: z.number().min(0),
  location: z.object({
    state: z.string(),
    city: z.string(),
  }),
  area: z.number().min(0),
  bedrooms: z.number().min(0),
  bathrooms: z.number().min(0),
  amenities: z.array(z.string()),
  furnished: z.boolean(),
  availableFrom: z.string().transform(str => new Date(str)),
  listedBy: z.string(),
  tags: z.array(z.string()),
  listingType: z.string(),
});

export type PropertyCreate = z.infer<typeof PropertyCreateSchema>;

export interface PaginationOptions {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}
