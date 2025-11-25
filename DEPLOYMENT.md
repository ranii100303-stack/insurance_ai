# ClaimFlowAI - Deployment Guide

## 🚀 Quick Deploy (FREE)

### Option 1: Railway (Recommended - Easiest)

1. **Sign up:** https://railway.app (free tier, no credit card required initially)
2. **Connect GitHub:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Authorize and select `ClaimFlowAI` repository
3. **Railway Auto-Deploys:**
   - Detects Node.js project
   - Runs `npm run build` automatically
   - Serves on a public URL
   - Environment variables handled automatically

**Your app will be live in ~2 minutes!**

### Option 2: Render (Free tier with limitations)

1. **Sign up:** https://render.com (free tier)
2. **Create Web Service:**
   - Click "New +" → "Web Service"
   - Connect GitHub repo
   - Select Branch: `main`
   - Build Command: `npm run build`
   - Start Command: `npm start`
   - Plan: Free
3. **Deploy**

### Option 3: Vercel (Good for frontend, complex for full-stack)

1. **Sign up:** https://vercel.com
2. **Import project** from GitHub
3. **Note:** Vercel works best with Next.js; this project uses Express

---

## 📋 What Gets Deployed

```
✅ Backend (Express server)
✅ Frontend (React + Vite)
✅ API routes (/api/claims)
✅ In-memory claim storage
✅ All UI components
✅ Tailwind styling & theme
```

---

## 🔧 Environment Variables

The app uses these defaults (already configured):

- **PORT**: Auto-set by platform (Railway/Render)
- **NODE_ENV**: production

No additional setup needed!

---

## 📊 Current Tech Stack

- **Frontend:** React 18, TypeScript, Tailwind CSS, Radix UI
- **Backend:** Express.js, Node.js
- **Storage:** In-memory (MemStorage)
- **Build:** Vite + esbuild
- **Hosting:** Railway/Render (Node.js)

---

## 🎯 What Works After Deploy

✅ View all claims on dashboard
✅ Create new claims
✅ Delete claims
✅ View claim details with AI assessment
✅ See photos for claims
✅ Dark/light theme toggle

---

## ⚠️ Limitations

- **Data resets** when app restarts (in-memory storage)
- To persist data permanently, add a database (PostgreSQL/MongoDB)

---

## 📱 Access Your App

After deployment, you'll get a URL like:
```
https://claimflowai-production.up.railway.app
```

Share this URL with anyone!

---

## 🔄 Auto-Deployments

Both Railway and Render auto-deploy when you push to `main`:
1. Make code changes locally
2. `git push` to GitHub
3. Platform auto-builds and deploys
4. New version live in 1-2 minutes

---

## 🆘 Troubleshooting

### "Build failed"
- Check deployment logs in platform dashboard
- Ensure `npm run build` works locally: `npm run build`

### "App won't start"
- Verify `npm start` works locally
- Check `PORT` is being read from environment

### "Photos not loading"
- Photos use external Unsplash URLs (always work if internet accessible)

---

## 💡 Next Steps

1. Choose Railway or Render above
2. Deploy (2 minutes)
3. Share the live URL
4. (Optional) Add a database for persistent storage

Happy deploying! 🎉
