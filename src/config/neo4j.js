import { Neogma } from 'neogma';
import dotenv from 'dotenv';

dotenv.config();

export const neogma = new Neogma(
  {
    url: process.env.NEO4J_URI,
    username: process.env.NEO4J_USERNAME,
    password: process.env.NEO4J_PASSWORD,
  },
  { logger: console.log }
);

neogma.driver.verifyConnectivity()
  .then(() => {
    console.log("✅ Connected to Neo4j database successfully!");
  })
  .catch((error) => {
    console.error("❌ Failed to connect to Neo4j:", error);
    process.exit(1); 
  });