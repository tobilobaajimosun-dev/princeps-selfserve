import { Injectable, computed, signal } from '@angular/core';

export interface ContactDraft {
  phone: string;
  email: string;
}

export type EmploymentType =
  | 'government'
  | 'paramilitary'
  | 'corper'
  | 'private-sector'
  | 'own-business';

export interface EmploymentDraft {
  type: EmploymentType;
  /** Only meaningful for corper: months remaining in service. */
  nyscMonthsRemaining?: number;
}

export type SalaryChannel = 'remita' | 'ippis' | 'dedukt';

export interface SalaryDraft {
  channel: SalaryChannel;
  bankCode: string;
  bankName: string;
  accountNumber: string;
  ippisNumber?: string;
  paramilitaryEmployer?: string;
  monthlyIncome: number;
}

export interface EligibilityDraft {
  score: number;
  decision: 'approved' | 'declined' | 'review';
  maxEligibleAmount: number;
  tenorMonths: number;
  reasons: string[];
}

export interface OfferDraft {
  productId: string;
  productName: string;
  amount: number;
  tenorMonths: number;
  ratePercent: number;
  interestModel: 'Flat Rate' | 'Reducing Balance' | 'Percentage Based';
  monthlyRepayment: number;
  fees: { name: string; amount: number }[];
}

export interface AddressDraft {
  street: string;
  state: string;
  lga: string;
}

export interface ProfileDraft {
  fullName: string;
  dateOfBirth: string;
  address: AddressDraft;
  relationshipStatus: 'single' | 'married' | 'divorced' | 'widowed';
  religion?: string;
}

export interface BvnDraft {
  value: string;
  verified: boolean;
  matchedName?: string;
}

export interface NinDraft {
  value: string;
  verified: boolean;
}

export interface MandateDraft {
  authorized: boolean;
  channel: SalaryChannel;
  monthlyAmount: number;
  tenorMonths: number;
  authorizedAt: string;
}

export type DocStatus = 'pending' | 'uploading' | 'uploaded' | 'failed';

export interface DocDraft {
  id: string;
  name: string;
  status: DocStatus;
  fileName?: string;
}

export type SubmissionStatus =
  | 'idle'
  | 'submitting'
  | 'approved'
  | 'review'
  | 'declined'
  | 'disbursement-pending';

export interface SubmissionDraft {
  status: SubmissionStatus;
  submittedAt?: string;
  reason?: string;
  referenceId?: string;
}

export interface ApplicationDraft {
  contact: ContactDraft | null;
  phoneVerified: boolean;
  isReturningCustomer: boolean;
  employment: EmploymentDraft | null;
  salary: SalaryDraft | null;
  eligibility: EligibilityDraft | null;
  offer: OfferDraft | null;
  profile: ProfileDraft | null;
  bvn: BvnDraft | null;
  nin: NinDraft | null;
  mandate: MandateDraft | null;
  docs: DocDraft[];
  submission: SubmissionDraft;
}

const empty: ApplicationDraft = {
  contact: null,
  phoneVerified: false,
  isReturningCustomer: false,
  employment: null,
  salary: null,
  eligibility: null,
  offer: null,
  profile: null,
  bvn: null,
  nin: null,
  mandate: null,
  docs: [],
  submission: { status: 'idle' },
};

@Injectable({ providedIn: 'root' })
export class ApplicationStateService {
  private readonly state = signal<ApplicationDraft>(empty);
  readonly draft = this.state.asReadonly();
  readonly contact = computed(() => this.state().contact);
  readonly phoneVerified = computed(() => this.state().phoneVerified);
  readonly isReturningCustomer = computed(() => this.state().isReturningCustomer);
  readonly employment = computed(() => this.state().employment);
  readonly salary = computed(() => this.state().salary);
  readonly eligibility = computed(() => this.state().eligibility);
  readonly offer = computed(() => this.state().offer);
  readonly profile = computed(() => this.state().profile);
  readonly bvn = computed(() => this.state().bvn);
  readonly nin = computed(() => this.state().nin);
  readonly mandate = computed(() => this.state().mandate);
  readonly docs = computed(() => this.state().docs);
  readonly submission = computed(() => this.state().submission);

  setContact(contact: ContactDraft): void {
    this.state.update((s) => ({ ...s, contact, phoneVerified: false }));
  }

  markPhoneVerified(): void {
    this.state.update((s) => ({ ...s, phoneVerified: true }));
  }

  setReturningCustomer(isReturning: boolean): void {
    this.state.update((s) => ({ ...s, isReturningCustomer: isReturning }));
  }

  setEmployment(employment: EmploymentDraft): void {
    this.state.update((s) => ({ ...s, employment }));
  }

  setSalary(salary: SalaryDraft): void {
    this.state.update((s) => ({ ...s, salary }));
  }

  setEligibility(eligibility: EligibilityDraft): void {
    this.state.update((s) => ({ ...s, eligibility }));
  }

  setOffer(offer: OfferDraft): void {
    this.state.update((s) => ({ ...s, offer }));
  }

  setProfile(profile: ProfileDraft): void {
    this.state.update((s) => ({ ...s, profile }));
  }

  setBvn(bvn: BvnDraft): void {
    this.state.update((s) => ({ ...s, bvn }));
  }

  setNin(nin: NinDraft): void {
    this.state.update((s) => ({ ...s, nin }));
  }

  setMandate(mandate: MandateDraft): void {
    this.state.update((s) => ({ ...s, mandate }));
  }

  setDocs(docs: DocDraft[]): void {
    this.state.update((s) => ({ ...s, docs }));
  }

  updateDoc(id: string, patch: Partial<DocDraft>): void {
    this.state.update((s) => ({
      ...s,
      docs: s.docs.map((d) => (d.id === id ? { ...d, ...patch } : d)),
    }));
  }

  setSubmission(submission: SubmissionDraft): void {
    this.state.update((s) => ({ ...s, submission }));
  }

  reset(): void {
    this.state.set(empty);
  }
}
