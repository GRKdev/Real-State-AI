import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import type { NextApiRequest, NextApiResponse } from 'next';

// Let's initialize it as null initially, and we will assign the actual database instance later.
let db: Database<sqlite3.Database, sqlite3.Statement> | null = null;

// Define the GET request handler function
export async function GET(req: NextApiRequest, res: NextApiResponse) {
  // Check if the database instance has been initialized
  if (!db) {
    // If the database instance is not initialized, open the database connection
    db = await open({
      filename: "./db/superior.db", // Specify the database file path
      driver: sqlite3.Database, // Specify the database driver (sqlite3 in this case)
    });
  }

  // Perform a database query to retrieve all items from the "items" table
  const items = await db.all("SELECT DISTINCT * FROM properties");

  // Return the items as a JSON response with status 200
  return new Response(JSON.stringify(items), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  });
}