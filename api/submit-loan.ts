// Vercel Function that proxies loan submissions from the browser to the
// princeps-backoffice ingest endpoint. The ingest token stays server-side.
//
// Security: SELFSERVE_INGEST_TOKEN and BACKOFFICE_API_URL are set as env vars
// in the Vercel project — never bundled into the Angular app.
// Input validation happens in the backoffice, but we reject obviously bad
// payloads here to save a round-trip.

export const config = { runtime: 'nodejs' };

const BACKOFFICE_URL = process.env.BACKOFFICE_API_URL ?? 'https://princeps-backoffice.vercel.app';
const INGEST_TOKEN = process.env.SELFSERVE_INGEST_TOKEN ?? '';

interface IncomingBody {
  borrowerBvn?: string;
  borrowerName?: string;
  borrowerPhone?: string;
  amountKobo?: number;
  tenorMonths?: number;
  monthlyRepaymentKobo?: number;
  interestModel?: string;
  ratePercent?: number;
  channel?: string;
  bankCode?: string | null;
  accountNumber?: string | null;
  ippisNumber?: string | null;
  employmentType?: string;
  employer?: string | null;
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return json({ error: { code: 'METHOD_NOT_ALLOWED', message: 'POST only.' } }, 405);
  }
  if (!INGEST_TOKEN) {
    return json({ error: { code: 'CONFIG', message: 'Server not configured.' } }, 500);
  }

  let body: IncomingBody;
  try {
    body = (await req.json()) as IncomingBody;
  } catch {
    return json({ error: { code: 'BAD_JSON', message: 'Invalid JSON.' } }, 400);
  }

  // Minimal sanity check — full validation is done downstream.
  if (!body?.borrowerBvn || !body?.amountKobo || !body?.tenorMonths || !body?.channel) {
    return json({ error: { code: 'VALIDATION_ERROR', message: 'Missing required fields.' } }, 400);
  }

  const upstream = await fetch(`${BACKOFFICE_URL}/api/loans`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${INGEST_TOKEN}`,
    },
    body: JSON.stringify(body),
  }).catch(() => null);

  if (!upstream) {
    return json({ error: { code: 'UPSTREAM_DOWN', message: 'Backoffice unreachable.' } }, 502);
  }

  const text = await upstream.text();
  return new Response(text, {
    status: upstream.status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function json(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
