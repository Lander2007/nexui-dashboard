# 🚀 Deploy NexUI Online - EASY METHOD

## Option 1: Vercel (RECOMMENDED - 2 minutes)

### Step 1: Go to Vercel
1. Visit https://vercel.com
2. Click "Sign Up" (use your GitHub account)

### Step 2: Import Your Project
1. Click "Add New..." → "Project"
2. Click "Import Git Repository"
3. Select your `nexui-dashboard` repository
4. Click "Import"

### Step 3: Configure & Deploy
1. **Framework Preset**: Vite
2. **Build Command**: `npm run build`
3. **Output Directory**: `dist`
4. Click "Deploy"

### Step 4: Done! 🎉
Your site will be live at: `https://your-project-name.vercel.app`

---

## Option 2: Netlify (Also Easy - 2 minutes)

### Step 1: Go to Netlify
1. Visit https://netlify.com
2. Click "Sign Up" (use your GitHub account)

### Step 2: Import Your Project
1. Click "Add new site" → "Import an existing project"
2. Choose "Deploy with GitHub"
3. Select your `nexui-dashboard` repository

### Step 3: Configure & Deploy
1. **Build command**: `npm run build`
2. **Publish directory**: `dist`
3. Click "Deploy site"

### Step 4: Done! 🎉
Your site will be live at: `https://your-site-name.netlify.app`

---

## Option 3: Manual Upload to Netlify (NO GITHUB NEEDED)

### Step 1: Build Locally
```bash
cd nexui
npm run build
```

### Step 2: Deploy
1. Go to https://app.netlify.com/drop
2. Drag and drop the `dist` folder
3. Your site is live instantly!

---

## 🎯 EASIEST METHOD: Use Netlify Drop

1. Open terminal in nexui folder
2. Run: `npm run build`
3. Go to: https://app.netlify.com/drop
4. Drag the `dist` folder to the page
5. **DONE!** Your site is live in 30 seconds!

---

## Troubleshooting

### White screen?
- Make sure `base: '/'` in vite.config.ts (already fixed)
- Clear browser cache
- Check browser console for errors

### Build fails?
- Run `npm install` first
- Make sure Node.js is installed

---

## 🌐 Your Site Will Be Live At:

**Vercel**: `https://nexui-dashboard.vercel.app`
**Netlify**: `https://nexui-dashboard.netlify.app`

Both are FREE and work perfectly with React apps!
