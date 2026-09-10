# Bidozerawa

A Kurdish/English drawing party game (Spyfall-style), with an offline
pass-and-play mode and an online mode with room codes, synced live via
Supabase.

## 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com), sign in, and click **New project**.
2. Once it's created, open **SQL Editor** in the left sidebar, paste the
   contents of `supabase-setup.sql` (included in this folder), and click
   **Run**. This creates the `rooms` table, sets its access policies, and
   turns on Realtime for it.
3. Open **Settings -> API**. You'll need two values from this page:
   - **Project URL**
   - **anon public** key

## 2. Add your Supabase keys

Copy `.env.example` to `.env` and fill in the two values from step 1:

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

## 3. Run it locally (optional, to test first)

```
npm install
npm run dev
```

Open the printed local URL in two browser tabs to test online mode as two
"players" — create a room in one tab, join it from the other.

## 4. Deploy to Netlify

**Option A — drag and drop (fastest):**

```
npm install
npm run build
```

This creates a `dist` folder. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
and drag that `dist` folder onto the page. Netlify gives you a live URL
immediately. Build locally with your `.env` file already filled in (step 2)
before dragging — your Supabase keys get baked into the build at that point.

**Option B — connect a Git repo (better if you'll keep editing this):**

1. Push this folder to a new GitHub repo.
2. In Netlify: **Add new site -> Import an existing project**, pick the repo.
3. Build command: `npm run build`, publish directory: `dist` (already set
   in `netlify.toml`, so Netlify should detect this automatically).
4. Before deploying, go to **Site configuration -> Environment variables**
   and add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` with your values
   from step 1.
5. Deploy. Every future push to the repo redeploys automatically.

## Notes

- Online play has no user accounts — anyone with a room's 4-letter code can
  join it. The Supabase table is set up so anyone with your site's public
  key can read/write room rows; that's normal for this kind of casual,
  no-login game, but don't reuse this `rooms` table for anything sensitive.
- Room rows aren't automatically deleted. For a small game night this is a
  non-issue; if you want automatic cleanup later, add a scheduled job in
  Supabase (see the commented-out line at the bottom of `supabase-setup.sql`).
