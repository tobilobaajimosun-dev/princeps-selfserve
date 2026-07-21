import { EmploymentType, SalaryChannel } from '../application/application-state.service';

export type RepaymentFrequency = 'monthly' | 'weekly' | 'bullet';

export interface ProductHero {
  from: string;
  to: string;
  glyph: string;
}

export interface Product {
  id: string;
  name: string;
  channel: SalaryChannel;
  employmentTypes: EmploymentType[];
  ratePercent: number;
  interestModel: 'Flat Rate' | 'Reducing Balance' | 'Percentage Based';
  repaymentFrequency: RepaymentFrequency;
  minAmount: number;
  maxAmount: number;
  fees: { name: string; percent?: number; flat?: number }[];
  hero: ProductHero;
}

const GLYPH_WALLET =
  'M4 8h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h11';
const GLYPH_SHIELD =
  'M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6l8-3z';
const GLYPH_BADGE =
  'M12 2l3 3h4v4l3 3-3 3v4h-4l-3 3-3-3H5v-4l-3-3 3-3V5h4l3-3z';
const GLYPH_SPARK =
  'M12 3v6M12 15v6M3 12h6M15 12h6M6 6l4 4M14 14l4 4M18 6l-4 4M10 14l-4 4';

export const PRODUCTS: Product[] = [
  {
    id: 'ippis-advance',
    name: 'IPPIS Salary Advance',
    channel: 'ippis',
    employmentTypes: ['government'],
    ratePercent: 4,
    interestModel: 'Reducing Balance',
    repaymentFrequency: 'monthly',
    minAmount: 50_000,
    maxAmount: 300_000,
    fees: [
      { name: 'Management fee', percent: 1 },
      { name: 'Insurance', percent: 0.5 },
    ],
    hero: { from: '#0B2E5B', to: '#3AB0C9', glyph: GLYPH_WALLET },
  },
  {
    id: 'ippis-standard',
    name: 'IPPIS Standard Loan',
    channel: 'ippis',
    employmentTypes: ['government'],
    ratePercent: 5,
    interestModel: 'Flat Rate',
    repaymentFrequency: 'monthly',
    minAmount: 100_000,
    maxAmount: 300_000,
    fees: [{ name: 'Processing fee', percent: 2 }],
    hero: { from: '#0B2E5B', to: '#F6A45B', glyph: GLYPH_BADGE },
  },
  {
    id: 'dedukt-primary',
    name: 'Paramilitary Dedukt Loan',
    channel: 'dedukt',
    employmentTypes: ['paramilitary'],
    ratePercent: 6,
    interestModel: 'Flat Rate',
    repaymentFrequency: 'monthly',
    minAmount: 50_000,
    maxAmount: 300_000,
    fees: [
      { name: 'Management fee', percent: 1 },
      { name: 'Insurance', flat: 2_000 },
    ],
    hero: { from: '#0B2E5B', to: '#5A6F8C', glyph: GLYPH_SHIELD },
  },
  {
    id: 'corper-allowee',
    name: 'NYSC Allowee Loan',
    channel: 'remita',
    employmentTypes: ['corper'],
    ratePercent: 5,
    interestModel: 'Flat Rate',
    repaymentFrequency: 'monthly',
    minAmount: 30_000,
    maxAmount: 300_000,
    fees: [{ name: 'Processing fee', flat: 1_500 }],
    hero: { from: '#F6A45B', to: '#3AB0C9', glyph: GLYPH_SPARK },
  },
];

export function productsFor(
  employment: EmploymentType,
  channel: SalaryChannel,
): Product[] {
  return PRODUCTS.filter(
    (p) => p.channel === channel && p.employmentTypes.includes(employment),
  );
}

export function productById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function calcFees(product: Product, amount: number): { name: string; amount: number }[] {
  return product.fees.map((f) => ({
    name: f.name,
    amount: Math.round(f.percent ? (amount * f.percent) / 100 : f.flat ?? 0),
  }));
}
