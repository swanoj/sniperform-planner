# Sniperform Shoot Planner — Handover

## What this is
A web-based shoot planning tool for Sniperform (Oliver's fitness grip brand). Built for planning video shoots with shot checklists, scripts, inspo/research uploads, and clip management with Google Drive integration.

## Live URLs
- **Production**: https://sniperform-planner-production.up.railway.app/
- **GitHub repo**: https://github.com/swanoj/sniperform-planner
- **Railway project**: "dazzling-patience" on Railway (swanoj's account)

## Architecture

### Hosting: Railway (Express server)
- Railway auto-deploys from `main` branch on GitHub
- Railway networking port is set to **8080** (Railway sets `PORT=8080` via env var)
- `server.js` uses `process.env.PORT || 3000` so it picks up 8080 from Railway
- Free tier — service sleeps after inactivity, first request wakes it (~5s cold start)

### Frontend: Single HTML file
- `public/index.html` — the entire app is one large HTML/CSS/JS file (~700+ lines)
- Served as static by Express
- Uses Google Identity Services (GIS) client-side library for OAuth
- No build step, no framework, no bundler

### Backend: Express + 3 API routes (currently unused by frontend)
- `server.js` — Express server, serves `public/` static and mounts API routes
- `api/auth-url.js` — generates Google OAuth URL (server-side flow)
- `api/auth-callback.js` — handles OAuth callback, exchanges code for tokens
- `api/refresh-token.js` — refreshes expired access tokens

**Important**: The frontend currently uses **client-side OAuth** via Google Identity Services (`window.google.accounts.oauth2.initTokenClient`), NOT the server-side API routes. The `api/` routes exist but are not called by the current frontend. They were from an earlier Netlify-based approach.

### Google OAuth setup
- **Client ID**: `998190177114-kl3rt9kh84nae872gk1rb6nrti11jdql.apps.googleusercontent.com`
- Client ID is hardcoded in `public/index.html` (search for `GOOGLE_CLIENT_ID`)
- OAuth consent screen: "Sniperform Planner", external, test mode
- Test user: `oliverjs090@gmail.com`
- Google Cloud project: "Sniperform Planner" (project ID: `sniperform-planner`)

### Google Cloud Console requirements
For Drive to work, the OAuth client needs:
- **Authorized JavaScript origins**: `https://sniperform-planner-production.up.railway.app`
- **Authorized redirect URIs**: `https://sniperform-planner-production.up.railway.app/api/auth-callback`
- **Google Drive API** must be enabled on the project

### Railway environment variables
- `GOOGLE_CLIENT_ID` — the OAuth client ID
- `GOOGLE_CLIENT_SECRET` — the OAuth client secret (rotate if compromised)

## Project structure
```
sniperform-planner/
├── public/
│   └── index.html          # The entire frontend app
├── api/
│   ├── auth-url.js         # Express handler: GET /api/auth-url
│   ├── auth-callback.js    # Express handler: GET /api/auth-callback
│   └── refresh-token.js    # Express handler: POST /api/refresh-token
├── netlify/                # Legacy — from original Netlify deployment, can be deleted
│   └── functions/
│       ├── auth-url.js
│       ├── auth-callback.js
│       └── refresh-token.js
├── server.js               # Express server entry point
├── package.json            # Express dependency, start script
├── package-lock.json
├── railway.json            # Railway deployment config (Nixpacks builder)
├── netlify.toml            # Legacy — can be deleted
└── README.md
```

## Frontend app features (all in index.html)
1. **4 video tabs** in left sidebar: Meta Ad, Hero Product Film, Talking Head, How-To
2. **4 content tabs** per video: Plan & Shots, Inspo & Research, Script & Copy, Upload Clips
3. **Shot checklists** — pre-populated shots per video with duration, checkboxes
4. **Google Drive integration** — connects via GIS, creates `Sniperform_Shoot/` folder structure, uploads clips to organized subfolders
5. **File naming system** — auto-names clips like `SF_META_spirit_level_hook_T1_270325.mp4`
6. **Export Plan** button — exports the shoot plan
7. **File Naming Guide** button — downloads naming reference

## Key frontend state variables (in index.html)
- `driveToken` — Google access token
- `driveEmail` — connected Google account email
- `rootFolderId` — Sniperform_Shoot folder ID in Drive
- `clips` — uploaded clip data per video/shot
- `VIDS` — array defining the 4 videos and their shots
- `AV` — active video index (0-3)
- `AT` — active tab ('plan', 'inspo', 'script', 'upload')

## Known issues / status
- **Google Drive connect**: Should work if authorized JavaScript origins are set correctly in Google Cloud Console. The app is in test mode so only added test users can authenticate.
- **The `netlify/` folder and `netlify.toml`** are legacy artifacts from the original Netlify deployment and can be safely deleted.
- **The `api/` server-side OAuth routes** are not used by the current frontend (which uses client-side GIS). They could be removed or repurposed if you want server-side token refresh.
- **Security**: The Google client secret was exposed in conversation history. It should be rotated in Google Cloud Console.

## How to make changes
1. Edit files in `~/Downloads/sniperform-planner/`
2. Test locally: `npm start` → open `http://localhost:3000`
3. Push to GitHub: `git add . && git commit -m "message" && git push`
4. Railway auto-deploys from main (takes ~30-60 seconds)

## Owner
- **Oliver** (swanoj on GitHub, oliverjs090@gmail.com / oliverjswan@gmail.com)
- Brand: **Sniperform** — fitness barbell grips
- This tool was built for a specific video shoot day to plan 4 videos (Meta ad, hero product, talking head, how-to/instructions) filmed in a gym environment
