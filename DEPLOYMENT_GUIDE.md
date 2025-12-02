# Deployment Guide: Push to GitHub and Deploy on Vercel

## Step 1: Install Git (if not already installed)

1. Download Git from: https://git-scm.com/download/win
2. Install it with default settings
3. Restart your terminal/PowerShell after installation

## Step 2: Configure Git (First time only)

Open PowerShell and run:
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## Step 3: Create a GitHub Repository

1. Go to https://github.com and sign in (or create an account)
2. Click the "+" icon in the top right → "New repository"
3. Name it `skillstack-website` (or any name you prefer)
4. **DO NOT** initialize with README, .gitignore, or license (we already have these)
5. Click "Create repository"

## Step 4: Push Your Code to GitHub

After Git is installed, open PowerShell in your project directory and run:

```bash
# Check git status
git status

# Add all files to staging
git add .

# Commit your changes
git commit -m "Initial commit"

# Add your GitHub repository as remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/skillstack-website.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Note:** GitHub will prompt you for credentials. Use a Personal Access Token (PAT) instead of password:
- Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
- Generate new token with `repo` permissions
- Use this token as your password when pushing

## Step 5: Deploy on Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. Go to https://vercel.com and sign in (use GitHub to sign in)
2. Click "Add New Project"
3. Import your GitHub repository (`skillstack-website`)
4. Vercel will auto-detect Next.js settings
5. Add environment variables if needed (check your `.env` requirements)
6. Click "Deploy"

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow the prompts
```

## Step 6: Configure Environment Variables on Vercel

If your app uses environment variables (like Supabase keys):

1. Go to your project on Vercel dashboard
2. Navigate to Settings → Environment Variables
3. Add all required variables (e.g., `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, etc.)
4. Redeploy your application

## Troubleshooting

- **Git not found**: Make sure Git is installed and terminal is restarted
- **Authentication failed**: Use Personal Access Token instead of password
- **Build errors**: Check Vercel build logs and ensure all environment variables are set
- **Deployment fails**: Make sure `package.json` has correct build scripts

## Next Steps After Deployment

- Your site will be live at: `https://your-project-name.vercel.app`
- Every push to `main` branch will trigger automatic deployment
- You can add a custom domain in Vercel settings

