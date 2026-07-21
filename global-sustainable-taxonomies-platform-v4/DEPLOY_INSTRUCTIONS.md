# Deploying the "Ask AI", "Translate Document", "Subscribe" and "Media Hub" features

Everything on this site (the map, country pages, the Media Hub's layout) is plain static HTML/CSS/JS — you can keep opening `index.html` directly and it all works exactly as before.

There are several backend-powered features, each needing a tiny serverless function because they rely on a private API key (a key can never be safely placed inside a webpage — anyone could read it in their browser's dev tools and use it on your bill):

- The **"Ask AI" tab** on the AI Advisor page — a real conversation with an AI model. Backend: `api/ask.js`.
- The **"Translate" button** next to each official document on a country page — fetches the official PDF/page, extracts its text, and translates it into the reader's selected site language via the same AI model. Backend: `api/translate-pdf.js`. Uses the same `ANTHROPIC_API_KEY` as "Ask AI" — no separate key needed.
- The **Subscribe page** — adds real subscribers to a Brevo mailing list. Backend: `api/subscribe.js`.
- The **Media Hub**'s News/Reports/Papers tabs — live headlines via Google News' public RSS feed. Backend: `api/news.js` (+ shared helper `api/_lib/rss.js`). **No API key needed.**
- The **Media Hub**'s AI Trend Insights cards and thematic chart — real AI analysis of the live News headlines above. Backend: `api/trends.js`. Uses the same `ANTHROPIC_API_KEY` as "Ask AI" — no separate key needed.

All of these are built for [Vercel](https://vercel.com). Until you deploy them, each feature shows a friendly, honest "not connected yet" message instead of fake content — everything else keeps working.

## What you need

1. An Anthropic API key — sign up / log in at **console.anthropic.com**, go to **Settings → API Keys**, and create a key. Anthropic bills based on usage, so keep the key private.
2. A Brevo account — sign up free at **brevo.com**. Go to **Settings → SMTP & API → API Keys** and generate a new API key. Then go to **Contacts → Lists**, create a list (e.g. "Website Subscribers"), and note its numeric list ID (shown in the list's settings/URL).
   - Optional: if you want the subscriber's interests and language preference to actually be stored on the contact (not just their email/name), go to **Contacts → Settings → Contact Attributes** and add two text attributes named `INTERESTS` and `LANGUAGE`. If you skip this, those two fields are simply not saved — email and name still are.
3. A free Vercel account — **vercel.com** (you can sign up with GitHub, GitLab, or email).

## Option A — Deploy from the Vercel dashboard (no command line)

1. Put all the files from this folder into a GitHub repository (create a new repo, drag all the files in, commit).
2. Go to vercel.com → **Add New… → Project** → import that GitHub repo.
3. Framework Preset: choose **Other** (this is a plain static site + serverless functions, no build step needed).
4. Before clicking Deploy, open **Environment Variables** and add:
   - `ANTHROPIC_API_KEY` = your key from step 1 above
   - (optional) `ANTHROPIC_MODEL` = `claude-sonnet-5` (this is the default if you skip it)
   - `BREVO_API_KEY` = your key from step 2 above
   - `BREVO_LIST_ID` = the numeric list ID from step 2 above (optional, but without it new subscribers are created in Brevo without being added to a specific list)
5. Click **Deploy**. Vercel will give you a URL like `https://your-project.vercel.app`.
6. Open that URL, go to **AI Advisor → Ask AI**, and try a question like "Compare the EU and South Korea taxonomies." Then open any country page and click **Translate** next to an official document to confirm that works too.
7. Go to **Subscribe**, submit the form with a real email, then check **Contacts → Lists** in your Brevo dashboard — the new contact should appear there within a few seconds.

## Option B — Deploy from your computer with the Vercel CLI

```
npm install -g vercel
cd path/to/this/folder
vercel login
vercel
```

Follow the prompts (link to a new project). Then add the environment variable and redeploy:

```
vercel env add ANTHROPIC_API_KEY
vercel --prod
```

## Notes

- The `api/ask.js` function reads `api/taxonomy-data.json` (a plain export of the site's country dataset) and sends it to the model as context, so answers are grounded in this site's data rather than the model's general knowledge alone.
- If you ever update the country data in `data.js`, regenerate `api/taxonomy-data.json` from it so the AI's answers stay in sync (ask me to do this any time you change the data).
- Nothing here sends your API key to the browser — only the Vercel server process reads `process.env.ANTHROPIC_API_KEY`.
- Costs: each question sent through "Ask AI", and each document translated, makes one call to the Anthropic API and is billed to your Anthropic account per Anthropic's normal API pricing.
- `api/translate-pdf.js` depends on the `pdf-parse` npm package (listed in `package.json`) to extract text from PDF documents — Vercel installs it automatically during deployment, no manual step needed. If an official document is a scanned image with no selectable text layer, translation isn't possible and the button shows a clear message saying so rather than guessing at content.
