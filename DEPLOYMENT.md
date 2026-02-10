# Deploying Miri Storybook to Vercel

This guide explains how to deploy your Storybook documentation to Vercel.

## 🚀 Quick Start

### Initial Setup (One-time)

1. **Go to Vercel:**
   - Visit [vercel.com](https://vercel.com)
   - Sign up/login with your GitHub account

2. **Import Project:**
   - Click "Add New Project"
   - Select your `miri` repository from the list
   - Click "Import"

3. **Configure Build Settings:**
   Vercel should auto-detect the settings from `vercel.json`, but verify:
   - **Framework Preset:** Other
   - **Build Command:** `npm run build-storybook`
   - **Output Directory:** `storybook-static`
   - **Install Command:** `npm install`

4. **Deploy:**
   - Click "Deploy"
   - Wait 2-3 minutes for the build to complete
   - Your Storybook will be live at `https://your-project.vercel.app`

## 🔄 Automatic Deployments

Once connected, Vercel automatically deploys on every push to `main`:

```bash
git add .
git commit -m "feat: update components"
git push origin main
# ✨ Vercel automatically builds and deploys!
```

### Branch Previews

Every pull request gets a unique preview URL:
- Create a branch: `git checkout -b feature/new-component`
- Push changes: `git push origin feature/new-component`
- Open a PR on GitHub
- Vercel creates a preview deployment with a unique URL

## 🎯 Build Locally (Optional)

Test the production build before deploying:

```bash
# Build Storybook for production
npm run build-storybook

# Preview the static build locally
npx serve storybook-static
```

Visit `http://localhost:3000` to preview.

## 🔧 Configuration Files

### vercel.json
Defines build settings for Vercel:
```json
{
  "buildCommand": "npm run build-storybook",
  "outputDirectory": "storybook-static",
  "framework": null,
  "installCommand": "npm install"
}
```

### .vercelignore
Excludes files from deployment to speed up uploads.

## 📝 Custom Domain (Optional)

Add a custom domain in Vercel dashboard:
1. Go to your project settings
2. Click "Domains"
3. Add your domain (e.g., `design.yourdomain.com`)
4. Follow DNS configuration instructions

## 🔒 Environment Variables

If you need environment variables:
1. Go to Project Settings → Environment Variables
2. Add variables for Production, Preview, or Development
3. Redeploy to apply changes

## 📊 Monitoring

Vercel provides:
- **Analytics:** Page views, performance metrics
- **Build Logs:** Detailed logs for each deployment
- **Preview URLs:** Test changes before merging

## 🐛 Troubleshooting

### Build Fails
- Check the Vercel build logs
- Verify `npm run build-storybook` works locally
- Ensure all dependencies are in `package.json` (not just `devDependencies`)

### Missing Fonts
- Google Fonts are loaded via `@import` in CSS
- Fonts load automatically when Storybook is hosted

### Storybook MCP Not Working
- MCP server only works locally (not in production)
- The deployed Storybook is purely documentation

## 🎉 Success!

Your Storybook is now:
- ✅ Automatically deployed on every push
- ✅ Accessible via a public URL
- ✅ Optimized for performance
- ✅ Ready to share with your team

Share your design system: `https://your-project.vercel.app`
