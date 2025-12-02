# Vercel Environment Variables Setup

## Required Environment Variables

Your application requires the following environment variables to be set in Vercel:

### Supabase Configuration

1. **NEXT_PUBLIC_SUPABASE_URL**
   - Your Supabase project URL
   - Format: `https://xxxxxxxxxxxxx.supabase.co`
   - Find it in: Supabase Dashboard → Settings → API → Project URL

2. **NEXT_PUBLIC_SUPABASE_ANON_KEY**
   - Your Supabase anonymous/public key
   - Format: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - Find it in: Supabase Dashboard → Settings → API → Project API keys → `anon` `public`

## How to Add Environment Variables in Vercel

### Method 1: Via Vercel Dashboard (Recommended)

1. Go to your project on [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your project name
3. Go to **Settings** tab
4. Click on **Environment Variables** in the left sidebar
5. Add each variable:
   - **Key**: `NEXT_PUBLIC_SUPABASE_URL`
   - **Value**: Your Supabase project URL
   - **Environment**: Select all (Production, Preview, Development)
   - Click **Save**
6. Repeat for `NEXT_PUBLIC_SUPABASE_ANON_KEY`
7. **Important**: After adding variables, go to **Deployments** tab and click **Redeploy** on the latest deployment

### Method 2: Via Vercel CLI

```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Login to Vercel
vercel login

# Link your project (if not already linked)
vercel link

# Add environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY

# Pull the variables to verify
vercel env pull
```

## Getting Your Supabase Credentials

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project (or create a new one)
3. Navigate to **Settings** → **API**
4. Copy:
   - **Project URL** → Use as `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → Use as `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## After Adding Variables

1. **Redeploy your application** in Vercel
   - Go to Deployments tab
   - Click the three dots (⋯) on the latest deployment
   - Click **Redeploy**

2. The build should now succeed and your app will be able to connect to Supabase

## Troubleshooting

- **Build still fails**: Make sure you clicked "Redeploy" after adding variables
- **Variables not working**: Ensure variables are set for all environments (Production, Preview, Development)
- **Can't find Supabase credentials**: Check your Supabase project settings → API section

