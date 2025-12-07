# How to Create a GitHub Personal Access Token

## Quick Steps:

1. **Go to GitHub Settings**
   - Visit: https://github.com/settings/tokens
   - Or: GitHub → Profile Picture → Settings → Developer settings → Personal access tokens → Tokens (classic)

2. **Generate New Token**
   - Click "Generate new token" → "Generate new token (classic)"

3. **Configure Token**
   - **Note**: Give it a descriptive name (e.g., "SkillStack Project")
   - **Expiration**: Choose your preferred expiration (or No expiration)
   - **Select scopes**: Check `repo` (this includes all repository permissions)
     - ✅ repo (Full control of private repositories)

4. **Generate and Copy**
   - Click "Generate token" at the bottom
   - **IMPORTANT**: Copy the token immediately (it starts with `ghp_`)
   - You won't be able to see it again!

## Using the Token

When Git prompts for credentials:
- **Username**: Your GitHub username
- **Password**: Paste your Personal Access Token (NOT your GitHub password)

## Security Best Practices

- ✅ Store tokens securely (use a password manager)
- ✅ Use different tokens for different projects
- ✅ Set expiration dates
- ✅ Revoke tokens you no longer need
- ❌ Never commit tokens to your repository
- ❌ Never share tokens publicly

## Revoking a Token

If you need to revoke a token:
1. Go to: https://github.com/settings/tokens
2. Find your token in the list
3. Click "Revoke" next to it


