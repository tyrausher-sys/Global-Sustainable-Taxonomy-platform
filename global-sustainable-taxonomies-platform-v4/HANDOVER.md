# Global Sustainable Taxonomies Platform — Project Handover

**From:** Tyra Usher, Summer Intern, Linköping University
**To:** Yoo, So Young — Head of AI Centre, BNZ PARTNERS
**Date:** 27 July 2026

---

## 1. Project Overview & Objective

The main objective of this internship was to design and develop the Global Sustainable Taxonomies Platform — a platform where users can easily access, compare, and better understand sustainable finance taxonomies from different countries.

## 2. Target Audience

- **Investors & Financial Institutions** — quickly check whether a country has a finished taxonomy before investing, and compare rules across countries.
- **Policymakers & Regulators** — look at how other countries have structured their taxonomies as inspiration when building their own frameworks.
- **Researchers** — rely on the platform as one collected, up-to-date data source instead of researching country by country.
- **Sustainability Professionals** — quickly check what rules apply in a given country to support accurate reporting and compliance.

## 3. Development Process & Tech Stack

The build went through six main stages: planning and goal definition, research and data collection on global taxonomies, wireframing and prototyping (three prototypes were built), AI-assisted development, core platform development, and testing/final improvements.

**Tools used**

- AI development tools evaluated: Manus AI and Lovable, before settling on **Claude** as the primary development platform.
- **GitHub** — version control and code hosting (new workflow learned during the internship).
- **Vercel** — hosting/deployment, serverless functions, and environment variables.
- **Brevo** — email contact management and the weekly digest campaign automation.

## 4. Platform Features

### Home screen (interactive map)

Entry point to the platform. A global map color-coded by taxonomy status (green = developed, orange = under development, grey = none). Includes a search bar (country / taxonomy / regulator) and region + status filters.

### Advanced search filtering

Two additional filters: "Filter by Environmental Objective" (e.g. Climate Change Mitigation, Circular Economy) and "Filter by Sector" (e.g. Energy, Agriculture) — both highlight only countries whose taxonomy has actual defined criteria for that goal or sector.

### Recently Updated panel

Sidebar module on the home page showing the latest additions or changes to the taxonomy database, by country, document title, and year.

### Country Detail Pages (e.g. South Korea)

Overview (status, regulator, year, region), a detailed written explanation of the taxonomy with numbered citations to primary sources, official documents, an Environmental Objectives breakdown, a Technical Screening Criteria table, an embedded country-specific AI Compliance Chat, and a "Compare With Another Taxonomy" tool for side-by-side comparison against any other country.

### AI Taxonomy Advisor

- **Multi-Country Comparison** — describe an activity, get an assessment of how it qualifies across multiple countries at once.
- **Country-Specific Advisor** — same analysis scoped to a single country.
- **Portfolio Comparison** — select multiple activities from a sector checklist; returns a jurisdiction-by-jurisdiction breakdown (Meets / Partial / Does Not Meet) across 196 reviewed jurisdictions, citing the specific matching article or act.
- **Ask AI** — open-ended questions about the dataset, answered by a live AI model.

> **Note:** all AI Advisor outputs are labeled as a simulated, illustrative analysis based on keyword matching — not a legal determination. This is intentional and should stay visible.

### Media & Trend Hub

Live news and reports pulled from Google News (filterable, searchable), AI Trend Insights (AI-generated thematic summaries of recent headlines), and a Taxonomy Development Timeline chart built from the platform's own dataset.

### Subscribe function

Visitors can subscribe via a form; they are automatically added as a contact in Brevo. Every Monday, a serverless function automatically drafts that week's digest email inside Brevo using live headlines — but it is never auto-sent. A human must review and click Send in Brevo (deliberate human-in-the-loop design). The Subscribe page also lists three not-yet-built roadmap items: Platform Alerts, BNZ Partners Insights, and Event Invitations.

### About page

Links to key external reference resources (official EU and Korean taxonomy documentation, Climate Bonds, UNEP FI, etc.) for anyone who wants primary sources directly.

## 5. Known Limitations

- Limited development time (seven-week internship).
- Limited AI credits and API integration challenges.
- Learning GitHub and Vercel from scratch during the project.
- Performance/speed issues in places — e.g. the translate buttons are slower than ideal.
- The official EU legal database does not allow servers to fetch PDFs directly — EU legislation links point to the official EUR-Lex webpage instead of a direct PDF, with a separate "View Original PDF" link to the source.
- YouTube/video content was deliberately excluded from the Media Hub, despite being in the original spec — video results were inconsistent in quality and harder to verify than text-based news, reports, and papers.

## 6. Future Improvements Roadmap

- Expand AI-powered features.
- Add more countries and keep taxonomy data updated.
- Improve multilingual support.
- Integrate more real-time data sources.
- Improve overall platform speed and performance.
- Build a dynamic content management system per country — an admin interface with version history so BNZ PARTNERS can update taxonomy criteria, documents, and regulatory amendments directly, without needing a developer. The current structure (per-country document and criteria sections) already lays the groundwork for this.

## 7. Access & Credentials Checklist

> This is the most time-sensitive part of the handover — several of these are currently tied to personal accounts and should be transitioned before intern access is removed.

| Item | What needs to happen |
|---|---|
| **GitHub repository** | Repo: `Global-Sustainable-Taxonomy-platform` (owner: `tyrausher-sys`). Add supervisor as Collaborator (Settings → Collaborators → Add people) or transfer ownership (Settings → Danger Zone → Transfer ownership). |
| **Vercel deployment** | Live at `global-sustainable-taxonomy-platfor.vercel.app`. Invite supervisor as a team member on the Vercel project, or transfer the project to a company-owned Vercel team/account. Domain and environment variables move with the project. |
| **Environment variables / API keys** | Includes the AI model API key, `BREVO_API_KEY`, `BREVO_SENDER_EMAIL`, `BREVO_SENDER_NAME`, and `DIGEST_TRIGGER_SECRET`. These are currently tied to personal accounts — recommend rotating to company-owned keys before access is removed, so the live site does not break when personal accounts are closed. |
| **Brevo (email/newsletter)** | Confirm whether the Brevo account is personal or already under BNZ PARTNERS. If personal, either transfer the account or create a company-owned Brevo account and update `BREVO_API_KEY` in Vercel. |
| **Weekly digest automation** | A scheduled job hits `/api/create-digest-draft` weekly, which creates a draft campaign in Brevo (never auto-sends). Someone must continue reviewing and clicking Send in Brevo each week, or this stops being useful. |
| **Google Drive documents** | Presentation slides, talk script, and planning docs live in Google Docs/Slides. Share the folder (or transfer ownership of each file) with the supervisor's Google account so access continues after the intern account is closed. |
| **Reference PDFs** | Plan, country taxonomy research, wireframes, and internship guidebook — forward these together with this handover. |

## 8. Reference Files

- `Plan - Internship 2026.pdf` — the original 7-week plan, weekly recap/review, aims, expectations, and limitations.
- `Countries taxonomy.pdf` — research on which countries/regions have a developed, in-progress, or absent taxonomy.
- `GST_Wireframes_v1.0.pdf` — early wireframes for the platform.
- `BNZ_Partners_Internship_Guidebook.pdf` — internship program guidebook.
- `Presentation tal.pdf` — the full talk script used for the final internship presentation, covering every feature in detail.
