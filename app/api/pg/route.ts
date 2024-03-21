import { type NextRequest } from 'next/server';
import { Pool } from 'pg';

import type { NextApiResponse } from 'next';
import { sql } from '@vercel/postgres';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export async function GET(request: NextRequest, res: NextApiResponse) {

  const searchParams = request.nextUrl.searchParams;
  const location = searchParams.get('location');
  const transaction_type = searchParams.get('transaction_type');
  const property_type = searchParams.get('property_type');
  const orderby = searchParams.get('order');
  const maxPrice = searchParams.get('maxprice');
  const minPrice = searchParams.get('minprice');
  const terrace = searchParams.get('terrace');
  const parking = searchParams.get('parking');
  const balcony = searchParams.get('balcony');
  const garden = searchParams.get('garden');
  const elevator = searchParams.get('elevator');
  const heating = searchParams.get('heating');
  const electrodometics = searchParams.get('electrodometics');
  const furnished = searchParams.get('furnished');


  const transactionTypes = transaction_type ? Array.from(new Set(transaction_type.split(','))) : [];
  let propertyTypes = property_type ? Array.from(new Set(property_type.split(','))) : [];
  let locations = location ? Array.from(new Set(location.split(','))) : [];

  locations = locations.map(loc => {
    const locInt = parseInt(loc, 10);
    if (locInt >= 1 && locInt <= 7) {
      return `parish${loc}`;
    }
    return loc;
  });

  propertyTypes = propertyTypes.map(pt => {
    const ptInt = parseInt(pt, 10);
    if (ptInt === 1 || ptInt === 2) {
      return `default${pt}`;
    }
    return pt;
  });

  let sqlQuery = "SELECT DISTINCT * FROM properties";
  const params = [];
  let conditions = [];

  if (locations.length > 0) {
    const locationConditions = locations.map(loc => {
      if (loc.startsWith('parish')) {
        params.push(loc.replace('parish', ''));
        return `parish = $${params.length}`;
      } else {
        // Assuming 'location' is an array that needs to be expanded in an IN clause
        params.push(loc); // This line might need adjustment based on your actual data structure
        return `location IN ($${params.length})`;
      }
    }).join(' OR ');
    conditions.push(`(${locationConditions})`);
  }

  if (transactionTypes.length > 0) {
    const placeholders = transactionTypes.map((_, index) => `$${params.length + index + 1}`);
    conditions.push(`transaction_type IN (${placeholders.join(',')})`);
    params.push(...transactionTypes);
  }
  
  // Handling propertyTypes with 'IN' and '=' conditions
  if (propertyTypes.length > 0) {
    const propertyConditions = propertyTypes.map(pt => {
      if (pt.startsWith('default')) {
        params.push(pt.replace('default', ''));
        return `property_default = $${params.length}`;
      } else {
        // If property_type needs to handle multiple values in an IN clause,
        // ensure the logic here matches how you intend to structure those queries.
        params.push(pt);
        return `property_type IN ($${params.length})`;
      }
    }).join(' OR ');
    conditions.push(`(${propertyConditions})`);
  }
  
  // Handling minPrice and maxPrice conditions
  if (minPrice) {
    conditions.push(`price >= $${params.length + 1}`);
    params.push(minPrice);
  }
  if (maxPrice) {
    conditions.push(`price <= $${params.length + 1}`);
    params.push(maxPrice);
  }
  
  // Adding WHERE conditions to the SQL query
  if (conditions.length > 0) {
    sqlQuery += " WHERE " + conditions.join(" AND ");
  }
  
  // Handling additional feature conditions
  const features = {
    terrace, parking, balcony, garden, elevator, heating, electrodometics, furnished
  };
  const extraConditions = Object.entries(features)
    .filter(([_, value]) => value)
    .map(([key, _]) => {
      params.push(true); // Assuming these features are boolean
      return `${key} = $${params.length}`;
    });
  
  if (extraConditions.length > 0) {
    if (conditions.length > 0) {
      sqlQuery += " AND ";
    } else {
      sqlQuery += " WHERE ";
    }
    sqlQuery += extraConditions.join(" AND ");
  }
  
  // Handling ORDER BY clause
  if (orderby) {
    const [orderByColumn, orderByDirection] = orderby.split('|');
    sqlQuery += ` ORDER BY ${orderByColumn} ${orderByDirection.toUpperCase()}`;
  }

console.log('SQL:', sqlQuery);
console.log('Params:', params);

try {
  const { rows: items } = await pool.query(sqlQuery, params);
    return new Response(JSON.stringify(items), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  });
} catch (error) {
  console.error(error);
  return new Response(JSON.stringify([]), {
    headers: { "Content-Type": "application/json" },
    status: 500,
  });
  }
}
