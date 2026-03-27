# Sniperform Shoot Planner

## Setup Guide

### Step 1 — Push to GitHub
1. Create a new repo on GitHub called `sniperform-planner`
2. Push this folder to it:
```
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/sniperform-planner.git
git push -u origin main
```

### Step 2 — Deploy on Netlify
1. Go to netlify.com → Add new site → Import from Git
2. Select your GitHub repo
3. Build settings are auto-detected from netlify.toml
4. Deploy — you'll get a URL like `https://sniperform-planner.netlify.app`

### Step 3 — Google Cloud Console (10 min)
1. Go to console.cloud.google.com
2. Create new project: "Sniperform Planner"
3. Enable the Google Drive API:
   - APIs & Services → Library → search "Google Drive API" → Enable
4. Create OAuth credentials:
   - APIs & Services → Credentials → Create Credentials → OAuth Client ID
   - Application type: Web application
   - Name: Sniperform Planner
   - Authorised redirect URIs: `https://YOUR-NETLIFY-URL.netlify.app/auth/callback`
5. Copy the Client ID and Client Secret

### Step 4 — Add Environment Variables to Netlify
In Netlify dashboard → Site Settings → Environment Variables, add:
```
GOOGLE_CLIENT_ID     = your-client-id-here
GOOGLE_CLIENT_SECRET = your-client-secret-here
```
Then redeploy.

### Step 5 — Done
Visit your Netlify URL, click "Connect Google Drive", sign in with Google.
Clips upload automatically to `Sniperform_Shoot/` folders in your Drive.

---

## How It Works

**Plan & Shots** — Shot timeline for each video with descriptions and director's notes
**Inspo & Research** — Upload reference images, paste competitor research and Firefly prompts
**Script & Copy** — Hook, full script, CTA, and CapCut overlay lines per video
**Upload Clips** — Drag raw clips into their matching shot slot. Auto-named and pushed to Drive.

### File Naming Convention
`SF_[VIDEO]_[SHOT]_[TAKE]_[DATE].mp4`

Example: `SF_META_spirit_level_hook_T1_270325.mp4`

### Drive Folder Structure
```
Sniperform_Shoot/
├── 01_Meta_Ad___Conversion/
├── 02_Hero_Product_Film/
├── 03_Talking_Head/
└── 04_How_To___Instructions/
```
