// ConstructQuery.ts

type QueryParams = {
    location?: string;
    property_type?: string;
    price?: string;
    bedrooms?: string;
    bathrooms?: string;
    square_meters?: string;
    transaction_type?: string;
    parish?: string;
    maxprice?: string;
    minprice?: string;
    maxbedrooms?: string;
    minbedrooms?: string;
    maxbathrooms?: string;
    minbathrooms?: string;
    maxsquare_meters?: string;
    minsquare_meters?: string;
    order?: string;
  };
  
  export function constructQuery(params: QueryParams): [string, any[]] {
    let baseQuery = "SELECT * FROM properties WHERE 1=1";
    let queryArgs: any[] = [];
  
    // Adjusted logic to include checks and correct prefix handling
    Object.entries(params).forEach(([key, value]) => {
      if (!value) return; // Skip undefined or empty parameters
      
      if (key === "location" || key === "property_type" || key === "transaction_type" || key === "parish") {
        const values = value.split(",").map(v => parseInt(v)).filter(v => !isNaN(v));
        if (values.length > 0) {
          baseQuery += ` AND ${key} IN (${values.map(() => "?").join(",")})`;
          queryArgs.push(...values);
        }
      } else if (key.startsWith("max") || key.startsWith("min")) {
        const field = key.substring(3); // Remove prefix to get the field name
        baseQuery += ` AND ${field} ${key.startsWith("max") ? "<=" : ">="} ?`;
        queryArgs.push(value);
      } else if (key === "order") {
        const [orderField, orderDirection] = value.split("|");
        baseQuery += ` ORDER BY ${orderField} ${orderDirection.toUpperCase()}`;
      } else {
        // For direct equality checks (price, bedrooms, etc.)
        baseQuery += ` AND ${key} = ?`;
        queryArgs.push(value);
      }
    });
  
    return [baseQuery, queryArgs];
  }
  