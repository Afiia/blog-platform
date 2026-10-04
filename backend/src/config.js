require('dotenv').config();
const { z } = require('zod');

// Fail fast with a readable error if the environment is misconfigured.
const schema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(5000),
  MONGO_URI: z.string().default('mongodb://127.0.0.1:27017/blogdb'),
  // 'true' runs a self-contained in-process MongoDB (no external DB needed; data resets on restart).
  USE_MEMORY_DB: z.enum(['true', 'false']).default('false'),
  JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 characters'),
  AUTO_SEED: z.enum(['true', 'false']).default('true'),
  CLIENT_ORIGIN: z.string().default('http://localhost:5173'),
});
const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  console.error('Invalid environment:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}
module.exports = parsed.data;
