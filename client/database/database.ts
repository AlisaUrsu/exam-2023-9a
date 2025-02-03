import * as SQLite from 'expo-sqlite';
import { Property } from '../model/Property';
import { PropertyFetchProps } from '../network/api';

let db: SQLite.SQLiteDatabase | null = null;

export const initializeDatabase = async (): Promise<void> => {
    if (!db) {
        db = await SQLite.openDatabaseAsync('properties.db');
      }
    
      await db.execAsync(`PRAGMA journal_mode = WAL;`);

      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS properties (
          id INTEGER PRIMARY KEY, 
          date TEXT, 
          type TEXT, 
          address TEXT, 
          bedrooms INTEGER, 
          bathrooms INTEGER, 
          price REAL, 
          area INTEGER, 
          notes TEXT
        );
      `);
}

export const fetchPropertiesFromDatabase = async (): Promise<Property[]> => {
    if (!db) throw new Error('Database not initialized!');
  
    const properties: Property[] = await db.getAllAsync('SELECT * FROM properties');
    const result: Property[] = [];
  
    for (const property of properties) {
      
  
      result.push({
        id: property.id,
        date: property.date,
        type: property.type,
        address: property.address,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        price: property.price,
        area: property.area,
        notes: property.notes

      });
    }
    return result;
}

export const fetchPropertyById = async (id: number): Promise<Property | null> => {
    if (!db) throw new Error('Database not initialized!');

    const result: Property | null = await db.getFirstAsync(
        'SELECT * FROM properties WHERE id = ?',
        [id]
    );

    if (!result) return null;

    const property: Property = {
        id: result.id as number,
        date: result.date as string,
        type: result.type as string,
        address: result.address as string,
        bedrooms: result.bedrooms as number,
        bathrooms: result.bathrooms as number,
        price: result.price as number,
        area: result.area as number,
        notes: result.notes as string,
    };

    return property;
};

export const syncPropertiesWithDatabase = async (properties: Property[]): Promise<void> => {
    if (!db) throw new Error('Database not initialized!');

    await db.execAsync('DELETE FROM properties');

    for (const property of properties) {
        await db.runAsync(
            `INSERT INTO properties (id, date, type, address, bedrooms, bathrooms, price, area, notes)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                property.id,
                property.date,
                property.type,
                property.address,
                property.bedrooms,
                property.bathrooms,
                property.price,
                property.area,
                property.notes,
            ]
        );
    }
};

export const syncPartsWithDatabase = async (properties: PropertyFetchProps[]): Promise<void> => {
    if (!db) throw new Error('Database not initialized!');

    await db.execAsync('DELETE FROM properties');

    for (const property of properties) {
        await db.runAsync(
            `INSERT INTO properties (id, address)
             VALUES (?, ?)`,
            [
                property.id,
                property.address,
            ]
        );
    }
};

export const syncPropertyByIdWithDatabase = async (property: Property): Promise<void> => {
    if (!db) throw new Error('Database not initialized!');

    await db.runAsync(
        `INSERT INTO properties (id, date, type, address, bedrooms, bathrooms, price, area, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET
            date = excluded.date,
            type = excluded.type,
            address = excluded.address,
            bedrooms = excluded.bedrooms,
            bathrooms = excluded.bathrooms,
            price = excluded.price,
            area = excluded.area,
            notes = excluded.notes;`,
        [
            property.id,
            property.date,
            property.type,
            property.address,
            property.bedrooms,
            property.bathrooms,
            property.price,
            property.area,
            property.notes,
        ]
    );

};


