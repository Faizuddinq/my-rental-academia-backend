import fs from 'fs';
import csv from 'csv-parser';
import path from 'path';
import { Property } from '../models/Property';
import { logger } from './logger';

interface PropertyCSV {
  id: string;
  title: string;
  type: string;
  price: string;
  state: string;
  city: string;
  areaSqFt: string;
  bedrooms: string;
  bathrooms: string;
  amenities: string;
  furnished: string;
  availableFrom: string;
  listedBy: string;
  tags: string;
  colorTheme: string;
  rating: string;
  isVerified: string;
  listingType: string;
}

export const importPropertiesFromCSV = async (filePath: string): Promise<void> => {
  const results: PropertyCSV[] = [];

  try {
    await new Promise((resolve, reject) => {
      fs.createReadStream(path.resolve(filePath))
        .pipe(csv())
        .on('data', (data: PropertyCSV) => results.push(data))
        .on('end', resolve)
        .on('error', reject);
    });

    for (const row of results) {
      const property = {
        propertyId: row.id,
        title: row.title,
        propertyType: row.type,
        price: parseFloat(row.price),
        location: {
          state: row.state,
          city: row.city
        },
        area: parseFloat(row.areaSqFt),
        bedrooms: parseInt(row.bedrooms),
        bathrooms: parseInt(row.bathrooms),
        amenities: row.amenities.split('|'),
        furnished: row.furnished.toLowerCase() === 'furnished',
        availableFrom: new Date(row.availableFrom),
        listedBy: row.listedBy,
        tags: row.tags.split('|'),
        colorTheme: row.colorTheme,
        rating: parseFloat(row.rating),
        isVerified: row.isVerified.toLowerCase() === 'true',
        listingType: row.listingType
      };

      await Property.findOneAndUpdate(
        { propertyId: property.propertyId },
        property,
        { upsert: true, new: true }
      );
    }

    logger.info(`Successfully imported ${results.length} properties`);
  } catch (error) {
    logger.error('Error importing properties:', error);
    throw error;
  }
};
