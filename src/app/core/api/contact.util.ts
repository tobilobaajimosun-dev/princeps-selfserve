/**
 * Normalize a Nigerian phone number to canonical +2348XXXXXXXXX.
 * Accepts: 080..., 0080..., +2348..., 2348..., 8... (10-digit local).
 * Returns null when the input can't be normalized to a valid MSISDN.
 */
export function normalizePhoneNg(raw: string): string | null {
  const digits = raw.replace(/\D/g, '');
  if (!digits) return null;

  let local: string;
  if (digits.startsWith('234')) local = digits.slice(3);
  else if (digits.startsWith('0')) local = digits.slice(1);
  else local = digits;

  if (local.length !== 10) return null;
  if (!/^[7-9]/.test(local)) return null;
  return `+234${local}`;
}

export function formatPhoneNgDisplay(canonical: string): string {
  const m = canonical.match(/^\+234(\d{3})(\d{3})(\d{4})$/);
  return m ? `+234 ${m[1]} ${m[2]} ${m[3]}` : canonical;
}

const COMMON_EMAIL_DOMAINS = [
  'gmail.com',
  'yahoo.com',
  'yahoo.co.uk',
  'hotmail.com',
  'outlook.com',
  'icloud.com',
  'live.com',
];

/** Levenshtein distance, capped for perf on short strings. */
function distance(a: string, b: string): number {
  const dp: number[] = Array(b.length + 1)
    .fill(0)
    .map((_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = i;
    for (let j = 1; j <= b.length; j++) {
      const cur = dp[j];
      dp[j] = a[i - 1] === b[j - 1] ? dp[j - 1] : Math.min(dp[j - 1], dp[j], prev) + 1;
      prev = cur;
    }
    dp[0] = i;
  }
  return dp[b.length];
}

/**
 * Non-blocking email typo hint. Returns a suggested address, or null when
 * nothing plausible is close. Callers must NOT block submission on this —
 * FLOW-SPEC Step 1: "non-blocking warning, don't hard-block submission."
 */
export function suggestEmailFix(email: string): string | null {
  const at = email.lastIndexOf('@');
  if (at <= 0 || at === email.length - 1) return null;
  const local = email.slice(0, at);
  const domain = email.slice(at + 1).toLowerCase();
  if (COMMON_EMAIL_DOMAINS.includes(domain)) return null;

  let best: { d: string; score: number } | null = null;
  for (const candidate of COMMON_EMAIL_DOMAINS) {
    const score = distance(domain, candidate);
    if (!best || score < best.score) best = { d: candidate, score };
  }
  if (best && best.score > 0 && best.score <= 2) return `${local}@${best.d}`;
  return null;
}

export function isValidEmailShape(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}
