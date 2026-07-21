import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TPipe } from '../../../core/i18n/t.pipe';
import { WizardProgressComponent } from '../wizard-progress.component';
import { ApplicationStateService } from '../../../core/application/application-state.service';
import {
  scoreEligibility,
  EligibilityInput,
  MdaCategory,
} from '../../../core/eligibility/eligibility-scoring';

const REVIEW_BAND_MIN = 45;
const REVIEW_BAND_MAX = 55;

@Component({
  selector: 'app-eligibility',
  imports: [TPipe, WizardProgressComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './eligibility.component.html',
  styleUrl: './eligibility.component.css',
})
export class EligibilityComponent implements OnInit {
  private readonly state = inject(ApplicationStateService);
  private readonly router = inject(Router);

  readonly phase = signal<'checking' | 'declined' | 'review'>('checking');
  readonly reasons = signal<string[]>([]);

  async ngOnInit(): Promise<void> {
    const employment = this.state.employment();
    const salary = this.state.salary();
    if (!employment || !salary) {
      await this.router.navigateByUrl('/apply/employment');
      return;
    }

    // Small deliberate delay so the spinner reads as work being done.
    await new Promise((r) => setTimeout(r, 700));

    const stability: EligibilityInput['stability'] =
      employment.type === 'corper'
        ? { type: 'nysc-corper', monthsRemaining: employment.nyscMonthsRemaining ?? 0 }
        : { type: 'mda', category: this.toMdaCategory(employment.type) };

    const input: EligibilityInput = {
      income: { source: this.incomeSource(), monthlyAmount: salary.monthlyIncome },
      stability,
      repaymentHistory: { isRepeatBorrower: this.state.isReturningCustomer() },
      exposure: { hasActiveLoanElsewhere: false },
    };

    const result = scoreEligibility(input);

    // Overlay a manual-review band (new tier per FLOW-SPEC — not in the scorer itself).
    let decision: 'approved' | 'declined' | 'review' = result.decision;
    if (
      result.decision === 'approved' &&
      result.score >= REVIEW_BAND_MIN &&
      result.score < REVIEW_BAND_MAX
    ) {
      decision = 'review';
    }

    this.state.setEligibility({
      score: result.score,
      decision,
      maxEligibleAmount: result.maxEligibleAmount,
      tenorMonths: result.tenorMonths,
      reasons: result.reasons,
    });

    if (decision === 'approved') {
      await this.router.navigateByUrl('/apply/offers');
      return;
    }
    if (decision === 'review') {
      this.phase.set('review');
      return;
    }
    this.reasons.set(result.reasons);
    this.phase.set('declined');
  }

  private toMdaCategory(t: string): MdaCategory {
    if (t === 'paramilitary') return 'paramilitary';
    if (t === 'government') return 'federal';
    return 'federal';
  }

  private incomeSource(): EligibilityInput['income']['source'] {
    const c = this.state.salary()?.channel;
    if (c === 'remita') return 'remita';
    if (c === 'dedukt') return 'deduct';
    return 'wacs';
  }

  home(): void {
    void this.router.navigateByUrl('/');
  }
}
