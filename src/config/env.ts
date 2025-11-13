import z from 'zod';
import { config } from 'dotenv';

config({ quiet: true });

const validatedEnv = z
  .object({
    PORT: z.coerce.number().int().min(0).max(65535).default(3000),
    NODE_ENV: z.enum(['development', 'production']).default('development'),
  })
  .parse(process.env);

export default () => validatedEnv;
