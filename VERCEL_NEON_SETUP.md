# Vercel + Neon Deployment Guide

## 📋 Prerequisites
- GitHub account with ClaimFlowAI repository
- Vercel account (free at vercel.com)
- Neon account (free at neon.tech)

---

## 🚀 Step-by-Step Deployment

### **Step 1: Create Neon Database (3 minutes)**

1. Go to https://neon.tech
2. Sign up with GitHub or email
3. Click "Create new project"
4. Choose a name: `claimflowai`
5. Copy the connection string (DATABASE_URL)
6. Keep it safe - you'll need it for Vercel

**Example connection string:**
```
postgresql://user:password@ep-xxx.us-east-1.neon.tech/claimflowai
```

---

### **Step 2: Initialize Database Schema**

Once you have the DATABASE_URL:

```bash
# In your local project
export DATABASE_URL="your-neon-connection-string"

# Run migrations
npm run db:push
```

This creates the `claims` and `users` tables in Neon.

---

### **Step 3: Deploy to Vercel (2 minutes)**

1. Go to https://vercel.com
2. Click "Add New" → "Project"
3. Click "Import Git Repository"
4. Select `ClaimFlowAI` repository
5. Click "Import"

**Configure Environment Variables:**
1. Under "Environment Variables"
2. Add:
   - **Name:** `DATABASE_URL`
   - **Value:** (paste your Neon connection string from Step 1)
3. Click "Add"
4. Click "Deploy"

**Wait 2-3 minutes for build to complete...**

---

### **Step 4: Verify Deployment**

- Vercel will show a success message with your live URL
- Visit the URL to see your app live!
- Click on a claim to verify database is working

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│                    Your Browser                        │
│                                                         │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
         ┌───────────────────────────────────┐
         │        Vercel Edge Network        │
         │   (Your deployed ClaimFlowAI)     │
         │                                   │
         │  ├─ React Frontend (Client)       │
         │  ├─ Express API (Server)          │
         │  └─ Build: Vite + esbuild        │
         └───────────────┬───────────────────┘
                         │
                         ▼
         ┌───────────────────────────────────┐
         │     Neon PostgreSQL Cloud         │
         │     (Database + Storage)          │
         │                                   │
         │  ├─ claims table                  │
         │  └─ users table                   │
         └───────────────────────────────────┘
```

---

## 🔄 How It Works

### **Local Development:**
- Uses **in-memory storage** (no database needed)
- Perfect for quick testing

### **Production (Vercel + Neon):**
- Reads `DATABASE_URL` environment variable
- Connects to Neon PostgreSQL
- Data persists across deployments
- All claims saved permanently

---

## 📊 Data Persistence

### **Before (In-Memory):**
- ❌ Data lost when app restarts
- ✅ Fast for local development
- ✅ No database setup needed

### **After (Neon):**
- ✅ Data persists forever
- ✅ Scales to millions of records
- ✅ Automatic backups
- ✅ Live production database

---

## 🔑 Environment Variables

Your app automatically uses:

| Variable | Source | Purpose |
|----------|--------|---------|
| `DATABASE_URL` | Neon | PostgreSQL connection |
| `NODE_ENV` | Vercel | Set to `production` |
| `PORT` | Vercel | Auto-assigned |

**No manual setup needed** - just add `DATABASE_URL` to Vercel!

---

## 🚀 Auto-Deployments

Every time you push to GitHub:

```bash
git add .
git commit -m "Update ClaimFlowAI"
git push origin main
```

**Vercel automatically:**
1. Pulls latest code from GitHub
2. Builds (`npm run build`)
3. Deploys new version
4. New version live in 2-3 minutes

---

## 📱 Features After Deploy

✅ View all claims from database
✅ Create new claims (saved to Neon)
✅ Delete claims (removed from database)
✅ View claim details with AI assessment
✅ See photos for claims
✅ Dark/light theme toggle
✅ **Data persists across app restarts!**

---

## 🆘 Troubleshooting

### **"DATABASE_URL is not set"**
- Add it in Vercel project settings
- Redeploy after adding

### **"Connection refused"**
- Verify Neon connection string is correct
- Check DATABASE_URL in Vercel dashboard
- Run `npm run db:push` locally first

### **"Build failed"**
- Check Vercel deployment logs
- Ensure `npm run build` works locally
- Verify package.json scripts

### **"Tables don't exist"**
- Run `npm run db:push` locally with DATABASE_URL
- This creates the schema in Neon

---

## 💡 Next Steps

1. **Create Neon project** at neon.tech
2. **Copy DATABASE_URL** from Neon console
3. **Run `npm run db:push`** locally to create tables
4. **Deploy to Vercel** and add DATABASE_URL environment variable
5. **Share your live URL** with anyone!

---

## 📊 Monitoring

### **View Database:**
- Go to neon.tech console
- Click your project
- See all tables and data

### **View Deployment Logs:**
- Go to vercel.com dashboard
- Click your project
- View build and runtime logs

### **View App Metrics:**
- Vercel dashboard shows usage
- Neon dashboard shows database activity

---

## 🎯 You're Done!

Your ClaimFlowAI is now:
- ✅ Live on Vercel (anyone can access)
- ✅ Data stored in Neon (persists forever)
- ✅ Auto-deploys on every push
- ✅ Production-ready

**Share your Vercel URL with the world!** 🎉
