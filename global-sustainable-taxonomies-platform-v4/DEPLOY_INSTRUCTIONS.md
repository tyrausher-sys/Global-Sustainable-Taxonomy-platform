# Deploying the "Ask AI", "Translate Document", "Subscribe" and "Media Hub" features

Everything on this site (the map, country pages, the Media Hub's layout) is plain static HTML/CSS/JS — you can keep opening `index.html` directly and it all works exactly as before.

There are several backend-powered features, each needing a tiny serverless function because they rely on a private API key (a key can never be safely placed inside a webpage — anyone could read it in their browser's dev tools and use it on your bill):

- The **"Ask AI" tab** on the AI Advisor page — a real conversation with an AI model. Backend: `api/ask.js`.
- The **"Translate" button** next to each official document on a country page — fetches the official PDF/page, extracts its text, and translates it into the reader's selected site language via the same AI model. Backend: `api/translate-pdf.js`. Uses the same `ANTHROPIC_API_KEY` as "Ask AI" — no separate key needed.
- **Live content translation on country pages** — when a reader picks a non-English language from the nav language selector, the researched country content itself (description paragraphs, environmental objective labels, activity-table cells, overlay text) is translated live, not just the menus. Backend: `api/translate-content.js`. Uses the same `ANTHROPIC_API_KEY` — no separate key needed. Proper nouns and anything that must match the original exactly (country/taxonomy/regulator names, official document titles, citation labels, all URLs) are deliberately left untranslated so they stay verifiable against the real source. Results are cached in the browser tab for the rest of the session, and if the request fails the page just quietly stays in English rather than breaking.
- The **Subscribe page** — adds real subscribers to a Brevo mailing list. Backend: `api/subscribe.js`.
- The **Media Hub**'s News/Reports/Papers tabs — live headlines via Google News' public RSS feed. Backend: `api/news.js` (+ shared helper `api/_lib/rss.js`). **No API key needed.**
- The **Media Hub**'s AI Trend Insights cards and thematic chart — real AI analysis of the live News headlines above. Backend: `api/trends.js`. Uses the same `ANTHROPIC_API_KEY` as "Ask AI" — no separate key needed.
- **Automated weekly digest email** — a real RSS feed of the site's live News/Reports/Papers headlines, published at `/api/digest-rss`, meant to be connected to Brevo's built-in "RSS Campaign" feature so a digest email goes out on a schedule without anyone needing to write or send it by hand each week. **No API key needed** beyond the `BREVO_API_KEY` already set up for Subscribe. See "Setting up the automated weekly digest" below.

All of these are built for [Vercel](https://vercel.com). Until you deploy them, each feature shows a friendly, honest "not connected yet" message instead of fake content — everything else keeps working.

## What you need

1. An Anthropic API key — sign up / log in at **console.anthropic.com**, go to **Settings → API Keys**, and create a key. Anthropic bills based on usage, so keep the key private.
2. A Brevo account — sign up free at **brevo.com**. Go to **Settings → SMTP & API → API Keys** and generate a new API key. Then go to **Contacts → Lists**, create a list (e.g. "Website Subscribers"), and note its numeric list ID (shown in the list's settings/URL).
   - Optional: if you want the subscriber's interests and language preference to actually be stored on the contact (not just their email/name), go to **Contacts → Settings → Contact Attributes** and add two text attributes named `INTERESTS` and `LANGUAGE`. If you skip this, `api/subscribe.js` automatically detects Brevo's "attribute is unknown" error and retries without that field, so the signup itself still succeeds — you won't lose subscribers over this being optional.
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

## Setting up the automated weekly digest

Once the site is deployed, `https://<your-domain>/api/digest-rss` is a live RSS feed of real, current taxonomy news/reports/papers headlines. Connect it to Brevo so a digest email is prepared automatically every week, with no one needing to write or trigger it by hand:

1. In Brevo, go to **Campaigns → Email** and look for **"RSS Campaign"** (on some plans this lives under **Automations** instead — search "RSS" in the Brevo help/search bar if you don't see it under Campaigns).
2. Paste in the feed URL: `https://<your-domain>/api/digest-rss`
3. Set the recurrence to **weekly** (pick whatever day/time you'd like it prepared).
4. Set the sending mode to **"Create a draft for review"** — this was the setting chosen for this project, so nothing ever goes out to real subscribers without you reviewing and clicking send first. (Brevo also offers a fully automatic "send without review" mode if you'd rather skip that step later.)
5. Choose the mailing list this should go to (the same list `BREVO_LIST_ID` points at).
6. Design the email template once in Brevo's editor — Brevo will keep reusing it, swapping in that week's headlines from the feed automatically.

What this digest includes: real, live headlines from Google News matching taxonomy/green-finance topics (the same source powering the Media Hub's News/Reports/Papers tabs). It deliberately does **not** include an AI-written trend summary (to avoid an AI API call every time Brevo checks the feed) or "BNZ Partners company updates" (there's no live feed of real company news to pull from — adding a placeholder for this would mean inventing content, which this project avoids). If a real source for company updates exists later (e.g. a company blog with its own RSS feed), it can be merged into this feed.

## Notes

- The `api/ask.js` function reads `api/taxonomy-data.json` (a plain export of the site's country dataset) and sends it to the model as context, so answers are grounded in this site's data rather than the model's general knowledge alone.
- If you ever update the country data in `data.js`, regenerate `api/taxonomy-data.json` from it so the AI's answers stay in sync (ask me to do this any time you change the data).
- Nothing here sends your API key to the browser — only the Vercel server process reads `process.env.ANTHROPIC_API_KEY`.
- Costs: each question sent through "Ask AI", and each document translated, makes one call to the Anthropic API and is billed to your Anthropic account per Anthropic's normal API pricing.
- `api/translate-pdf.js` depends on the `pdf-parse` npm package (listed in `package.json`) to extract text from PDF documents — Vercel installs it automatically during deployment, no manual step needed. If an official document is a scanned image with no selectable text layer, translation isn't possible and the button shows a clear message saying so rather than guessing at content.
