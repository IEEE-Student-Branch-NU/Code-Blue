/* ─── Join campaign — single source of truth ──────────────────────
 * Read by both the Home page popup (RecruitmentPopup) and the
 * Join Us page banner (JoinCampaignBanner). Edit here, both update.
 * When CAMPAIGN_END passes, both disappear on their own.
 * ---------------------------------------------------------------- */

export const FORM_URL = 'https://forms.gle/XK3TLpRK3MjmyHw26'
export const CAMPAIGN_END = new Date('2026-07-31T23:59:59+05:30')  // IST

const DAY_MS = 86400000

export const isCampaignLive = () => Date.now() < CAMPAIGN_END.getTime()

export const daysRemaining = () =>
    Math.ceil((CAMPAIGN_END.getTime() - Date.now()) / DAY_MS)

export const deadlineLabel = () => {
    const days = daysRemaining()
    if (days <= 1) return 'Last day to apply'
    if (days === 2) return 'Closes tomorrow'
    return `Closes in ${days} days`
}

export const openForm = () => {
    window.open(FORM_URL, '_blank', 'noopener,noreferrer')
}

/* The campaign's signature motif — a scope trace, shared by both
 * surfaces so the popup and the banner read as one campaign.
 * Flat line, square pulse, sine bump, flat again. Drawn in a
 * 280 x 28 viewBox. */
export const TRACE_PATH =
    'M0,14 H44 L44,5 L62,5 L62,23 L80,23 L80,14 H112 C122,14 124,4 132,4 C140,4 142,24 150,24 C158,24 160,14 170,14 H280'
