# 📤 How to Upload NexUI to GitHub

Follow these steps to upload your project to GitHub:

## Step 1: Initialize Git Repository

Open your terminal in the `nexui` folder and run:

```bash
git init
git add .
git commit -m "Initial commit: NexUI Network Intelligence Dashboard"
```

## Step 2: Create GitHub Repository

1. Go to [GitHub](https://github.com)
2. Click the **+** icon in the top right
3. Select **New repository**
4. Fill in the details:
   - **Repository name**: `nexui-dashboard` (or your preferred name)
   - **Description**: "AI-powered network intelligence dashboard with voice assistant"
   - **Visibility**: Choose Public or Private
   - **DO NOT** initialize with README (we already have one)
5. Click **Create repository**

## Step 3: Connect Local Repository to GitHub

After creating the repository, GitHub will show you commands. Use these:

```bash
git remote add origin https://github.com/YOUR_USERNAME/nexui-dashboard.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

## Step 4: Verify Upload

1. Refresh your GitHub repository page
2. You should see all your files uploaded
3. The README.md will be displayed on the repository homepage

## 🌐 Optional: Deploy to GitHub Pages

To make your dashboard live on the web:

### 1. Update `vite.config.ts`:

```typescript
export default defineConfig({
  plugins: [react()],
  base: '/nexui-dashboard/', // Replace with your repo name
})
```

### 2. Install gh-pages:

```bash
npm install --save-dev gh-pages
```

### 3. Add to `package.json` scripts:

```json
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}
```

### 4. Deploy:

```bash
npm run deploy
```

### 5. Enable GitHub Pages:

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under **Source**, select `gh-pages` branch
4. Click **Save**
5. Your site will be live at: `https://YOUR_USERNAME.github.io/nexui-dashboard/`

## 📝 Common Git Commands

```bash
# Check status
git status

# Add all changes
git add .

# Commit changes
git commit -m "Your commit message"

# Push to GitHub
git push

# Pull latest changes
git pull

# View commit history
git log --oneline
```

## 🔧 Troubleshooting

### Error: "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/nexui-dashboard.git
```

### Error: "failed to push"
```bash
git pull origin main --rebase
git push origin main
```

### Large files warning
If you get warnings about large files (node_modules), make sure `.gitignore` is working:
```bash
git rm -r --cached node_modules
git commit -m "Remove node_modules"
git push
```

## 🎉 You're Done!

Your NexUI dashboard is now on GitHub! Share the link with others:
`https://github.com/YOUR_USERNAME/nexui-dashboard`

---

**Need Help?** Check [GitHub Docs](https://docs.github.com/en/get-started/quickstart/create-a-repo)
