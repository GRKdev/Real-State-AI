import { type NextRequest } from 'next/server';
import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import type { NextApiResponse } from 'next';

let db: Database<sqlite3.Database, sqlite3.Statement> | null = null;

export async function GET(request: NextRequest, res: NextApiResponse) {
  if (!db) {
    db = await open({
      filename: "./db/superior.db",
      driver: sqlite3.Database,
    });
  }

  const searchParams = request.nextUrl.searchParams;
  const location = searchParams.get('location');
  const transaction_type = searchParams.get('transaction_type');
  const property_type = searchParams.get('property_type');
  const orderby = searchParams.get('orderby');
  const maxPrice = searchParams.get('maxprice');
  const minPrice = searchParams.get('minprice');
  
  let locations = location ? location.split(',') : [];
  const transactionTypes = transaction_type ? transaction_type.split(',') : [];
  let propertyTypes = property_type ? property_type.split(',') : [];

  // Process locations for parish
  locations = locations.map(loc => {
    const locInt = parseInt(loc, 10);
    if (locInt >= 1 && locInt <= 7) {
      return `parish${loc}`;
    }
    return loc;
  });

  // Process propertyTypes for property_default
  propertyTypes = propertyTypes.map(pt => {
    const ptInt = parseInt(pt, 10);
    if (ptInt === 1 || ptInt === 2) {
      return `default${pt}`;
    }
    return pt;
  });

  let sql = "SELECT DISTINCT * FROM properties";
  const params = [];

  // Constructing WHERE conditions for locations
  if (locations.length > 0) {
    const locationConditions = "(" + locations.map(loc => loc.startsWith('parish') ? "parish = ?" : "location IN (?)").join(' OR ') + ")";
    sql += ` WHERE ${locationConditions}`;
    params.push(...locations.map(loc => loc.startsWith('parish') ? loc.replace('parish', '') : loc));
}

  // Constructing WHERE/AND conditions for transactionTypes
  if (transactionTypes.length > 0) {
    sql += " AND transaction_type IN (" + transactionTypes.map(() => '?').join(',') + ")";
    params.push(...transactionTypes);
}

  // Constructing AND conditions for propertyTypes, considering property_default
  if (propertyTypes.length > 0) {
    // Similarly, group propertyTypes conditions if necessary
    const propertyConditions = propertyTypes.map(pt => pt.startsWith('default') ? "property_default = ?" : "property_type IN (?)").join(' OR ');
    sql += ` AND (${propertyConditions})`;
    params.push(...propertyTypes.map(pt => pt.startsWith('default') ? pt.replace('default', '') : pt));
}


  if (orderby) {
    const [orderByColumn, orderByDirection] = orderby.split('|');
    if (['price', 'location', 'property_type', 'transaction_type'].includes(orderByColumn) && 
        ['asc', 'desc'].includes(orderByDirection.toLowerCase())) {
      sql += ` ORDER BY ${orderByColumn} ${orderByDirection.toUpperCase()}`;
    }
  }
console.log(sql);
console.log(params);
  try {
    const items = await db.all(sql, params);
    return new Response(JSON.stringify(items), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching data.' });
  }
}
