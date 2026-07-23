/* /api/create-digest-draft.js — Vercel serverless function (Node.js runtime)
 *
 * Creates this week's digest as a real DRAFT email campaign inside Brevo,
 * via Brevo's own Campaigns API — ready in the Brevo dashboard for Tyra to
 * review and click Send. Nothing is ever emailed automatically by this
 * function; it only creates the draft.
 *
 * Why this exists instead of Brevo's "RSS Campaign" feature: that feature
 * is documented in Brevo's help center, but could not be located anywhere
 * in this live Brevo account — not under Campaigns → Create (only
 * "Regular"/"A/B Test"), and not under Automations → Pre-built automation
 * types (checked both "Most popular" and the full "All" list of 12
 * templates — none RSS-related). It may be deprecated, renamed, or gated to
 * a different plan tier. Rather than depend on a feature that isn't
 * reachable, this endpoint does the equivalent job directly through Brevo's
 * Campaigns API (https://developers.brevo.com/reference/createemailcampaign),
 * which is available on every plan.
 *
 * How it's triggered weekly: a Cowork scheduled task calls this endpoint
 * (GET) once a week. There is no code running on a timer inside Vercel —
 * the schedule lives in Cowork, this endpoint just does the work when hit.
 *
 * Content: the same real, live News/Reports/Papers headlines that power
 * api/digest-rss.js and the Media Hub (via Google News' public RSS search).
 * Deliberately excludes an AI trend blurb (extra API cost for no benefit)
 * and any "BNZ Partners company updates" (no real source to pull from —
 * inventing one would be fabricated content).
 *
 * Required environment variables (Vercel project settings):
 *   BREVO_API_KEY       — already set up for api/subscribe.js
 *   BREVO_SENDER_EMAIL   — a sender address verified in Brevo (Settings →
 *                          Senders & IP) — Brevo rejects campaigns from an
 *                          unverified sender
 *   BREVO_SENDER_NAME    — display name for that sender (e.g. "Global
 *                          Sustainable Taxonomies")
 * Optional:
 *   BREVO_LIST_ID        — same list api/subscribe.js adds contacts to; if
 *                          unset, the draft is created with no recipient
 *                          list attached and needs one picked manually
 *                          before sending
 *   DIGEST_TRIGGER_SECRET — if set, this endpoint requires ?key=<that value>
 *                          on every request, so a stranger who finds the URL
 *                          can't spam draft campaigns into the account.
 *                          Recommended. The Cowork scheduled task is
 *                          configured to send this automatically once set.
 *
 * GET /api/create-digest-draft
 *   -> { ok: true, campaignId, itemCount } on success
 *   -> { ok: false, error } on failure (nothing partial is left behind —
 *      Brevo either creates the whole campaign or it doesn't exist at all)
 */

const { buildFeedItems, escapeHtml } = require("./_lib/digest-content");

function buildHtmlEmail(items, siteUrl) {
  const rows = items.map(item => `
      <tr>
        <td style="padding:14px 0;border-bottom:1px solid #e5e5e5;">
          <div style="font-size:11px;letter-spacing:.05em;text-transform:uppercase;color:#6b8f71;font-weight:600;margin-bottom:4px;">${escapeHtml(item.section)}</div>
          <a href="${escapeHtml(item.link)}" style="font-size:16px;font-weight:600;color:#1a2b23;text-decoration:none;">${escapeHtml(item.title)}</a>
          <div style="font-size:13px;color:#7a7a7a;margin-top:4px;">${escapeHtml(item.source || "Google News")}</div>
        </td>
      </tr>`).join("");

  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f4f4f2;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f2;padding:24px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;">
          <tr>
            <td style="background:#1a2b23;padding:28px 32px;">
              <div style="color:#ffffff;font-size:20px;font-weight:700;">Global Sustainable Taxonomies</div>
              <div style="color:#9fc2a8;font-size:13px;margin-top:4px;">Weekly Digest</div>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 32px 8px;">
              <p style="font-size:14px;color:#444;margin:0 0 16px;">This week's taxonomy news, reports and research, gathered automatically:</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px 28px;">
              <a href="${escapeHtml(siteUrl)}/media.html" style="display:inline-block;background:#1a2b23;color:#ffffff;text-decoration:none;padding:10px 20px;border-radius:5px;font-size:14px;font-weight:600;">Visit the Media Hub</a>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 32px;border-top:1px solid #eee;">
              <p style="font-size:12px;color:#999;margin:0;">© 2026 BNZ PARTNERS — Global Sustainable Taxonomies</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ ok: false, error: "Method not allowed. Use GET." });
    return;
  }

  const requiredSecret = process.env.DIGEST_TRIGGER_SECRET;
  if (requiredSecret) {
    const provided = (req.query && req.query.key) || "";
    if (provided !== requiredSecret) {
      res.status(401).json({ ok: false, error: "Missing or incorrect key." });
      return;
    }
  }

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    res.status(500).json({ ok: false, error: "BREVO_API_KEY is not set in Vercel project settings." });
    return;
  }

  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  const senderName = process.env.BREVO_SENDER_NAME || "Global Sustainable Taxonomies";
  if (!senderEmail) {
    res.status(500).json({
      ok: false,
      error: "BREVO_SENDER_EMAIL is not set. Add a sender verified in Brevo (Settings → Senders & IP) as the BREVO_SENDER_EMAIL environment variable in Vercel, then redeploy."
    });
    return;
  }

  const siteUrl = process.env.SITE_URL || "https://global-sustainable-taxonomy-platfor.vercel.app";

  try {
    const items = await buildFeedItems();
    if (!items.length) {
      res.status(200).json({ ok: false, error: "No live headlines were found this week — no draft was created (avoids sending an empty digest)." });
      return;
    }

    const htmlContent = buildHtmlEmail(items, siteUrl);
    const today = new Date().toISOString().slice(0, 10);

    const payload = {
      name: `Weekly Digest — ${today}`,
      subject: `Your weekly taxonomy digest — ${today}`,
      sender: { name: senderName, email: senderEmail },
      type: "classic",
      htmlContent
    };

    const listId = process.env.BREVO_LIST_ID;
    if (listId && !isNaN(Number(listId))) {
      payload.recipients = { listIds: [Number(listId)] };
    }

    const upstream = await fetch("https://api.brevo.com/v3/emailCampaigns", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "accept": "application/json",
        "api-key": apiKey
      },
      body: JSON.stringify(payload)
    });

    const data = await upstream.json().catch(() => ({}));

    if (!upstream.ok) {
      const msg = (data && data.message) || `Brevo API error (HTTP ${upstream.status})`;
      res.status(upstream.status).json({ ok: false, error: msg });
      return;
    }

    res.status(200).json({ ok: true, campaignId: data.id, itemCount: items.length });
  } catch (err) {
    res.status(502).json({ ok: false, error: "Failed to build or create the digest draft: " + err.message });
  }
};
