import { type NextRequest } from 'next/server';
import { Pool } from 'pg';
import { auth } from '@clerk/nextjs';


const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});



export async function GET(request: NextRequest) {
  // const { userId } = auth();
  // if (!userId) {
  //   return new Response('Unauthorized', { status: 401 });
  // }

  const searchParams = request.nextUrl.searchParams;
  const queryParams = {
    location: searchParams.get('location'),
    transaction_type: searchParams.get('transaction_type'),
    property_type: searchParams.get('property_type'),
    orderby: searchParams.get('order'),
    maxPrice: searchParams.get('maxprice'),
    minPrice: searchParams.get('minprice'),
    terrace: searchParams.get('terrace'),
    parking: searchParams.get('parking'),
    balcony: searchParams.get('balcony'),
    garden: searchParams.get('garden'),
    elevator: searchParams.get('elevator'),
    heating: searchParams.get('heating'),
    electrodometics: searchParams.get('electrodometics'),
    furnished: searchParams.get('furnished'),
    reference_number: searchParams.get('reference_number'),
    bedrooms: searchParams.get('bed'),
    bathrooms: searchParams.get('bath'),
    minBedrooms: searchParams.get('minbed'),
    maxBedrooms: searchParams.get('maxbed'),
    minBathrooms: searchParams.get('minbath'),
    maxBathrooms: searchParams.get('maxbath'),
  };

  const { sqlQuery, params } = constructQuery(queryParams);

  if (params.length === 0) {
    return new Response(JSON.stringify([]), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  }

  try {
    const { rows: items } = await pool.query(sqlQuery, params);
    return new Response(JSON.stringify(items), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify([]), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}

function constructQuery(queryParams: any) {
  let sqlQuery = 'SELECT DISTINCT * FROM properties';
  const conditions = [];
  const params = [];
  const orderBy = queryParams.orderby ? queryParams.orderby.split('|') : [];

  if (queryParams.location) {
    const locationCondition = getLocationCondition(queryParams.location, params.length);
    conditions.push(locationCondition.condition);
    params.push(...locationCondition.values);
  }

  if (queryParams.property_type) {
    const propertyCondition = getPropertyTypeCondition(queryParams.property_type, params.length);
    conditions.push(propertyCondition.condition);
    params.push(...propertyCondition.values);
  }

  for (const [key, value] of Object.entries(queryParams)) {
    if (!value || ['orderby', 'location', 'property_type'].includes(key)) continue;
    const { condition, values } = getConditionAndValues(key, value.toString(), params.length);
    conditions.push(condition);
    params.push(...values);
  }

  if (conditions.length > 0) {
    sqlQuery += ' WHERE ' + conditions.join(' AND ');
  }

  if (orderBy.length === 2) {
    sqlQuery += ` ORDER BY ${orderBy[0]} ${orderBy[1].toUpperCase()}`;
  }
  console.log(sqlQuery, params);
  return { sqlQuery, params };
}

function getLocationCondition(value: string, offset: number) {
  const locations = value.split(',').map(loc => {
    const locInt = parseInt(loc, 10);
    return locInt >= 1 && locInt <= 7 ? `parish${loc}` : loc;
  });
  const condition = locations.map((loc, index) => {
    if (loc.startsWith('parish')) {
      return `parish = $${offset + index + 1}`;
    } else {
      return `location = $${offset + index + 1}`;
    }
  }).join(' OR ');
  return { condition: `(${condition})`, values: locations.map(loc => loc.replace('parish', '')) };
}

function getPropertyTypeCondition(value: string, offset: number) {
  const propertyTypes = value.split(',').map(pt => {
    const ptInt = parseInt(pt, 10);
    return ptInt === 1 || ptInt === 2 ? `default${pt}` : pt;
  });
  const condition = propertyTypes.map((pt, index) => {
    if (pt.startsWith('default')) {
      return `property_default = $${offset + index + 1}`;
    } else {
      return `property_type = $${offset + index + 1}`;
    }
  }).join(' OR ');
  return { condition: `(${condition})`, values: propertyTypes.map(pt => pt.replace('default', '')) };
}

const operatorMap = {
  maxPrice: '<=',
  minPrice: '>=',
  min: '>=',
  max: '<=',
};

function getConditionAndValues(key: string, value: string, offset: number) {
  const inConditionKeys = ['location', 'transaction_type', 'property_type'];
  const numericKeys = ['price', 'bedrooms', 'bathrooms', 'referenceNumber'];
  const booleanKeys = ['terrace', 'parking', 'balcony', 'garden', 'elevator', 'heating', 'electrodometics', 'furnished'];

  if (inConditionKeys.includes(key)) {
    const values = value.split(',');
    const placeholders = values.map((_, index) => `$${offset + index + 1}`).join(', ');
    return { condition: `${key} IN (${placeholders})`, values };
  }

  const baseKey = key.replace(/^(min|max)/, '').toLowerCase();
  const operator = operatorMap[key.toLowerCase() as keyof typeof operatorMap] || operatorMap[key.slice(0, 3) as keyof typeof operatorMap] || '=';
  const actualKey = numericKeys.includes(baseKey) ? baseKey : key;

  if (booleanKeys.includes(key)) {
    return { 
      condition: `${actualKey} = $${offset + 1}`, 
      values: [value === '1' || value.toLowerCase() === 'true']
    };
  }

  return { 
    condition: `${actualKey} ${operator} $${offset + 1}`, 
    values: [numericKeys.includes(baseKey) ? value : value === 'true']
  };
}