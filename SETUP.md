# Cloud login + backup (Supabase) — one-time setup, ~10 minutes

The app works without this. Do it if you want Google sign-in and progress that follows you between devices.

1. Go to https://supabase.com, sign in, **New project** (free plan is fine). Wait until it finishes starting.
2. **SQL Editor → New query**, paste everything from `supabase/schema.sql`, press **Run**. (Creates one table; each user can only see their own row.)
3. **Project Settings → API**: copy the **Project URL** and the **anon public key**. Paste them into `config.js`.
4. **Authentication → Providers → Google**: switch it on. It asks for a Google *Client ID* and *Secret*:
   - https://console.cloud.google.com → create a project → **APIs & Services → OAuth consent screen** (External) → **Credentials → Create credentials → OAuth client ID → Web application**.
   - Under **Authorised redirect URIs** add the callback URL shown on Supabase's Google provider page (looks like `https://YOUR-PROJECT.supabase.co/auth/v1/callback`).
   - Copy the Client ID and Secret back into Supabase and save.
5. **Authentication → URL Configuration**: set **Site URL** to `http://localhost:5173` and add `http://localhost:5173/index.html` to **Redirect URLs**. (When you host the site online later, add that address too.)
6. Run the app with `start.bat` (it must be `http://localhost`, not a double-clicked file) and press **Sign in with Google** on the welcome screen or in Settings.

Notes
- Sync rule: when you sign in, the newer copy (this device vs the cloud) wins; after that every change is saved to the cloud about 1.5 seconds later.
- Never put the **service_role** key in config.js — only the anon key.
