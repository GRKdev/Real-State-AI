// database.ts

import { open, Database } from 'sqlite';
import sqlite3 from 'sqlite3';

async function getDatabaseConnection(): Promise<Database<sqlite3.Database, sqlite3.Statement>> {
  return open({
    filename: 'db/superior.db', // Adjust as needed
    driver: sqlite3.Database,
  });
}

export async function queryDb(query: string, args: any[] = [], one: boolean = false) {
  const db = await getDatabaseConnection();
  args = args || []; // Ensure args is an array
  if (one) {
    const row = await db.get(query, ...args);
    return row || null;
  } else {
    const rows = await db.all(query, ...args);
    return rows;
  }
}

export async function getPropertiesByRef(refPrefix: string, ref: string, excludedKeys: string[]) {
  const fullRef = `${refPrefix}${ref}`;
  const query = "SELECT * FROM properties WHERE reference_number = ?";
  const property = await queryDb(query, [fullRef], true);

  if (property) {
    const result = Object.entries(property).reduce((acc, [key, value]) => {
      if (!excludedKeys.includes(key)) {
        acc[key] = value;
      }
      return acc;
    }, {} as { [key: string]: any });
    return result;
  } else {
    return null;
  }
}
