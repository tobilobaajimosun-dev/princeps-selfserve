import { InjectionToken, Injectable } from '@angular/core';

export type LookupResult =
  | { kind: 'new' }
  | { kind: 'returning'; profileHint: string };

export interface SalaryVerifyInput {
  channel: 'remita' | 'ippis' | 'dedukt';
  bankCode: string;
  accountNumber: string;
  ippisNumber?: string;
  employer?: string;
}

export type SalaryVerifyResult =
  | { status: 'ok'; monthlyIncome: number; accountName: string }
  | { status: 'name-mismatch' }
  | { status: 'not-found' }
  | { status: 'service-down' };

export type BvnVerifyResult =
  | { status: 'ok'; matchedName: string }
  | { status: 'name-mismatch'; matchedName: string }
  | { status: 'not-found' }
  | { status: 'service-down' };

export interface DocUploadInput {
  docId: string;
  fileName: string;
  sizeBytes: number;
}

export type DocUploadResult =
  | { status: 'ok' }
  | { status: 'too-large' }
  | { status: 'bad-type' }
  | { status: 'network' };

export interface SubmitPayload {
  contact: { phone: string; email: string };
  employment: { type: string };
  offer: { productId: string; amount: number; tenorMonths: number };
  bvn: string;
}

export type SubmitResult =
  | { status: 'approved'; referenceId: string }
  | { status: 'review'; referenceId: string; etaHours: number }
  | { status: 'declined'; referenceId: string; reason: string }
  | { status: 'disbursement-pending'; referenceId: string };

export interface Bank {
  code: string;
  name: string;
}

export interface ApiClient {
  lookupContact(input: { phone: string; email: string }): Promise<LookupResult>;
  sendEmailOtp(email: string): Promise<{ target: string; expiresInSeconds: number }>;
  verifyEmailOtp(
    email: string,
    code: string,
  ): Promise<
    | { status: 'ok' }
    | { status: 'wrong' }
    | { status: 'expired' }
    | { status: 'locked'; retryAfterSeconds: number }
  >;
  listBanks(): Promise<Bank[]>;
  verifySalary(input: SalaryVerifyInput): Promise<SalaryVerifyResult>;
  verifyBvn(bvn: string, fullName: string): Promise<BvnVerifyResult>;
  uploadDocument(input: DocUploadInput): Promise<DocUploadResult>;
  submitApplication(payload: SubmitPayload): Promise<SubmitResult>;
  joinWaitlist(input: { phone: string; email: string; type: string }): Promise<{ status: 'ok' }>;
}

export const API_CLIENT = new InjectionToken<ApiClient>('ApiClient');

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!domain) return email;
  const head = local.slice(0, 2);
  return `${head}${'•'.repeat(Math.max(local.length - 2, 1))}@${domain}`;
}

const NG_BANKS: Bank[] = [
  { code: '044', name: 'Access Bank' },
  { code: '063', name: 'Access Bank (Diamond)' },
  { code: '050', name: 'Ecobank Nigeria' },
  { code: '070', name: 'Fidelity Bank' },
  { code: '011', name: 'First Bank of Nigeria' },
  { code: '214', name: 'First City Monument Bank' },
  { code: '058', name: 'Guaranty Trust Bank' },
  { code: '030', name: 'Heritage Bank' },
  { code: '301', name: 'Jaiz Bank' },
  { code: '082', name: 'Keystone Bank' },
  { code: '526', name: 'Parallex Bank' },
  { code: '076', name: 'Polaris Bank' },
  { code: '101', name: 'Providus Bank' },
  { code: '221', name: 'Stanbic IBTC Bank' },
  { code: '068', name: 'Standard Chartered Bank' },
  { code: '232', name: 'Sterling Bank' },
  { code: '100', name: 'SunTrust Bank' },
  { code: '032', name: 'Union Bank of Nigeria' },
  { code: '033', name: 'United Bank for Africa' },
  { code: '215', name: 'Unity Bank' },
  { code: '035', name: 'Wema Bank' },
  { code: '057', name: 'Zenith Bank' },
  { code: '999', name: 'Opay' },
  { code: '998', name: 'Kuda Microfinance Bank' },
  { code: '997', name: 'Palmpay' },
];

/**
 * In-process mock. Deterministic:
 * - Contact email `returning@princeps.ng` → returning customer.
 * - OTP `123456` = ok, `000000` = expired, else wrong.
 * - Account `0000000000` = not found; `1111111111` = name mismatch;
 *   `9999999999` = service down; anything else = ok at ₦180,000/mo.
 * - BVN `00000000000` = not-found, `11111111111` = name mismatch,
 *   `99999999999` = service-down, else ok.
 */
@Injectable({ providedIn: 'root' })
export class MockApiClient implements ApiClient {
  async lookupContact(input: { phone: string; email: string }): Promise<LookupResult> {
    await delay(600);
    if (input.email.toLowerCase() === 'returning@princeps.ng') {
      return { kind: 'returning', profileHint: 'A. Adeyemi' };
    }
    return { kind: 'new' };
  }

  async sendEmailOtp(email: string) {
    await delay(500);
    return { target: maskEmail(email), expiresInSeconds: 300 };
  }

  async verifyEmailOtp(_email: string, code: string) {
    await delay(500);
    if (code === '123456') return { status: 'ok' } as const;
    if (code === '000000') return { status: 'expired' } as const;
    return { status: 'wrong' } as const;
  }

  async listBanks(): Promise<Bank[]> {
    await delay(150);
    return NG_BANKS;
  }

  async verifySalary(input: SalaryVerifyInput): Promise<SalaryVerifyResult> {
    await delay(900);
    if (input.accountNumber === '9999999999') return { status: 'service-down' };
    if (input.accountNumber === '0000000000') return { status: 'not-found' };
    if (input.accountNumber === '1111111111') return { status: 'name-mismatch' };
    return { status: 'ok', monthlyIncome: 180_000, accountName: 'A. Adeyemi' };
  }

  async verifyBvn(bvn: string, _fullName: string): Promise<BvnVerifyResult> {
    await delay(900);
    if (bvn === '99999999999') return { status: 'service-down' };
    if (bvn === '00000000000') return { status: 'not-found' };
    if (bvn === '11111111111') return { status: 'name-mismatch', matchedName: 'A. Different' };
    return { status: 'ok', matchedName: 'A. Adeyemi' };
  }

  async uploadDocument(input: DocUploadInput): Promise<DocUploadResult> {
    await delay(800);
    if (input.sizeBytes > 10 * 1024 * 1024) return { status: 'too-large' };
    return { status: 'ok' };
  }

  async submitApplication(payload: SubmitPayload): Promise<SubmitResult> {
    await delay(1200);
    const ref = 'PR-' + Math.random().toString(36).slice(2, 8).toUpperCase();
    // Deterministic-ish: use amount to pick a status for demo variety.
    const bucket = payload.offer.amount % 4;
    if (bucket === 0) return { status: 'approved', referenceId: ref };
    if (bucket === 1) return { status: 'review', referenceId: ref, etaHours: 24 };
    if (bucket === 2) return { status: 'disbursement-pending', referenceId: ref };
    return { status: 'declined', referenceId: ref, reason: 'Insufficient repayment capacity.' };
  }

  async joinWaitlist(_input: { phone: string; email: string; type: string }) {
    await delay(500);
    return { status: 'ok' as const };
  }
}
