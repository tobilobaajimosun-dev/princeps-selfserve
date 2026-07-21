import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TPipe } from '../../../core/i18n/t.pipe';
import { ApplicationStateService } from '../../../core/application/application-state.service';
import { formatNaira } from '../../../core/money.util';

@Component({
  selector: 'app-welcome-back',
  imports: [TPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './welcome-back.component.html',
  styleUrl: './welcome-back.component.css',
})
export class WelcomeBackComponent {
  private readonly state = inject(ApplicationStateService);
  private readonly router = inject(Router);

  readonly snapshot = this.state.returningSnapshot;
  readonly formatNaira = formatNaira;

  readonly lastLoanLabel = computed(() => {
    const s = this.snapshot();
    if (!s) return '';
    return new Date(s.lastLoanAt).toLocaleDateString('en-NG', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  });

  constructor() {
    if (!this.state.phoneVerified() || !this.state.isReturningCustomer() || !this.snapshot()) {
      void this.router.navigateByUrl('/apply/employment');
    }
  }

  borrowAgain(): void {
    const s = this.snapshot();
    if (!s) return;
    this.state.setEmployment({ type: s.employmentType });
    this.state.setSalary({
      channel: s.employmentType === 'paramilitary' ? 'dedukt'
        : s.employmentType === 'corper' ? 'remita'
        : 'ippis',
      bankCode: '058',
      bankName: s.bankName,
      accountNumber: `000000${s.accountLast4}`,
      monthlyIncome: s.monthlyIncome,
    });
    this.state.setProfile({
      fullName: s.fullName,
      dateOfBirth: '1993-04-18',
      address: { street: '14 Adeniyi Jones Avenue', state: 'Lagos', lga: 'Ikeja' },
      relationshipStatus: 'single',
    });
    this.state.setBvn({
      value: '22222222222',
      verified: true,
      matchedName: s.fullName,
      dateOfBirth: '1993-04-18',
      phone: this.state.contact()?.phone,
      address: { street: '14 Adeniyi Jones Avenue', state: 'Lagos', lga: 'Ikeja' },
    });
    this.state.setNin({ value: '22222222222', verified: true });
    void this.router.navigateByUrl('/apply/eligibility');
  }

  updateDetails(): void {
    void this.router.navigateByUrl('/apply/employment');
  }
}
