# Chromatic Setup Guide

This project uses Chromatic for automated visual regression, accessibility, and interaction testing.

## ✅ Already Configured

- ✅ Chromatic package installed (`chromatic@15.0.0`)
- ✅ Storybook addon installed (`@chromatic-com/storybook@5.0.1`)
- ✅ Accessibility addon installed (`@storybook/addon-a11y`)
- ✅ Interaction testing addon installed (`@storybook/addon-vitest`)
- ✅ NPM script configured (`npm run chromatic`)
- ✅ GitHub Actions workflow created

## 🔐 Setup GitHub Secret

To enable automated Chromatic runs on GitHub:

1. **Get your Chromatic project token:**
   - Go to https://www.chromatic.com
   - Sign in with your GitHub account
   - Find your project token (starts with `chpt_`)
   - Current token in `package.json`: `chpt_ee59013b49e9ac7`

2. **Add secret to GitHub:**
   - Go to: https://github.com/MannyCH/miri/settings/secrets/actions
   - Click "New repository secret"
   - Name: `CHROMATIC_PROJECT_TOKEN`
   - Value: `chpt_ee59013b49e9ac7` (or your token)
   - Click "Add secret"

3. **Verify setup:**
   - Push a change to any Storybook component
   - Check GitHub Actions tab for "Chromatic Visual Testing" workflow
   - Review results at https://www.chromatic.com

## 📊 What Gets Tested

### Automatic Testing Triggers:

Changes to:
- `src/components/**` - Component files
- `src/patterns/**` - Pattern files
- `src/foundations/**` - Foundation/token files
- `src/*-tokens.css` - Design token files
- `.storybook/**` - Storybook configuration
- `package.json` - Dependencies

### NOT Tested:

- `src/pages/**` - Web app pages (uses Storybook components)
- `src/App.jsx` - App routing
- `src/context/**` - State management
- Documentation-only changes
- README updates

## 🎯 Testing Features

### 1. Visual Regression Testing
- Captures screenshots of all Storybook stories
- Compares with previous baseline
- Detects pixel-perfect changes
- Supports multiple viewports (mobile, tablet, desktop)

### 2. Accessibility Testing
- WCAG 2.1 Level AA compliance
- Color contrast checking
- ARIA attribute validation
- Keyboard navigation testing

### 3. Interaction Testing
- Component behavior testing
- Event handler verification
- State management validation
- Form interaction testing

## 🔔 Notifications

Configure notifications in Chromatic settings:

1. **Email Notifications:**
   - Build failures
   - New accessibility violations
   - Build completion

2. **GitHub Integration:**
   - PR status checks
   - Build results in PR comments
   - Approval workflow

3. **Slack Integration** (optional):
   - Real-time build notifications
   - Team collaboration

## 📖 Workflow

### Manual Testing (Development)

```bash
# 1. Make changes to components
# 2. Test locally in Storybook
npm run storybook

# 3. Run Chromatic
npm run chromatic

# 4. Review at chromatic.com
# - Check visual changes
# - Review accessibility issues
# - Approve or deny changes

# 5. Commit and push
git add .
git commit -m "feat(components): update button styles"
git push
```

### Automated Testing (CI/CD)

```bash
# Chromatic runs automatically on push
git push origin main

# Check GitHub Actions:
# https://github.com/MannyCH/miri/actions

# Review results:
# https://www.chromatic.com
```

## 🎨 Design Token Testing

Chromatic is especially valuable for design token updates:

```bash
# Update a color token
# Example: Change --color-text-strong from #260B00 to #1A0800

npm run chromatic

# Chromatic shows ALL affected components
# - Buttons with text-strong color
# - Headings using text-strong
# - Any component using the token

# Review impact across entire component library
# Approve if all changes are expected
```

## 🐛 Troubleshooting

### Build Fails Immediately

**Cause:** Missing dependencies
**Fix:** `npm ci` to install all dependencies

### Build Succeeds but No Snapshots

**Cause:** No stories found
**Fix:** Ensure `.stories.jsx` files exist in components

### Accessibility Errors

**Cause:** WCAG violations detected
**Fix:** Review Chromatic accessibility report and fix violations

### Visual Changes Not Detected

**Cause:** Changes outside tested directories
**Fix:** Check `.github/workflows/chromatic.yml` paths

## 💰 Pricing

**Free Tier:**
- 5,000 snapshots/month
- Unlimited team members
- Basic features

**Paid Plans:** (if needed)
- More snapshots
- Advanced features
- Priority support

**Your current usage:**
- ~30 components × 3 viewports × 2 states = ~180 snapshots per build
- Should stay within free tier easily

## 📊 Metrics & Reporting

Chromatic tracks:
- Build frequency
- Test coverage
- Accessibility score
- Visual change frequency
- Time to approval

View at: https://www.chromatic.com/reports

## 🔗 Useful Links

- Chromatic Dashboard: https://www.chromatic.com
- Documentation: https://www.chromatic.com/docs
- GitHub Actions: https://github.com/MannyCH/miri/actions
- Storybook: http://localhost:6006

## ✅ Next Steps

1. **Add GitHub secret** (see above)
2. **Push a test change** to verify automation
3. **Configure notifications** in Chromatic settings
4. **Review first build** at chromatic.com
5. **Approve baseline** to establish reference

After setup, Chromatic will automatically guard your component library against:
- Unintended visual changes
- Accessibility regressions
- Interaction bugs
- Design token breaking changes
