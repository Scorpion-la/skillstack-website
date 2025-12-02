import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  const missingVars: string[] = [];
  if (!supabaseUrl) missingVars.push('NEXT_PUBLIC_SUPABASE_URL');
  if (!supabaseAnonKey) missingVars.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');

  const errorMessage = `
Missing required Supabase environment variables: ${missingVars.join(', ')}

Please set the following environment variables:
${missingVars.map(v => `  - ${v}`).join('\n')}

For local development, create a .env.local file with:
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

For Vercel deployment, add these in:
Project Settings → Environment Variables

See VERCEL_ENV_SETUP.md for detailed instructions.
  `.trim();

  // During build time, throw an error to fail fast
  // During runtime, also throw to prevent silent failures
  throw new Error(errorMessage);
}

// Create client with validated environment variables
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
