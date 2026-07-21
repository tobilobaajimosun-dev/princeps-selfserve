import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TPipe } from '../../../core/i18n/t.pipe';
import { WizardProgressComponent } from '../wizard-progress.component';
import { ApplicationStateService } from '../../../core/application/application-state.service';
import { formatNaira } from '../../../core/money.util';

interface ScheduleRow {
  month: number;
  principal: number;
  interest: number;
  payment: number;
  balance: number;
}

@Component({
  selector: 'app-terms',
  imports: [TPipe, WizardProgressComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './terms.component.html',
  styleUrl: './terms.component.css',
})
export class TermsComponent implements OnInit {
  private readonly state = inject(ApplicationStateService);
  private readonly router = inject(Router);

  readonly offer = this.state.offer;
  readonly agreed = signal(false);
  readonly formatNaira = formatNaira;

  readonly schedule = computed<ScheduleRow[]>(() => {
    const o = this.offer();
    if (!o) return [];
    return buildSchedule(o.amount, o.tenorMonths, o.ratePercent, o.interestModel);
  });

  readonly totalRepayable = computed(() =>
    this.schedule().reduce((acc, r) => acc + r.payment, 0),
  );

  readonly totalFees = computed(() =>
    (this.offer()?.fees ?? []).reduce((acc, f) => acc + f.amount, 0),
  );

  async ngOnInit(): Promise<void> {
    if (!this.offer()) await this.router.navigateByUrl('/apply/offers');
  }

  toggleAgree(v: boolean): void {
    this.agreed.set(v);
  }

  back(): void {
    void this.router.navigateByUrl('/apply/offers');
  }

  take(): void {
    if (!this.agreed()) return;
    void this.router.navigateByUrl('/apply/profile');
  }
}

function buildSchedule(
  principal: number,
  n: number,
  ratePercent: number,
  model: 'Flat Rate' | 'Reducing Balance' | 'Percentage Based',
): ScheduleRow[] {
  const r = ratePercent / 100;
  const rows: ScheduleRow[] = [];
  if (model === 'Reducing Balance') {
    const pmt = r === 0 ? principal / n : (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    let balance = principal;
    for (let m = 1; m <= n; m++) {
      const interest = balance * r;
      const principalPaid = pmt - interest;
      balance -= principalPaid;
      rows.push({
        month: m,
        principal: Math.round(principalPaid),
        interest: Math.round(interest),
        payment: Math.round(pmt),
        balance: Math.max(0, Math.round(balance)),
      });
    }
  } else if (model === 'Percentage Based') {
    const principalPerMonth = principal / n;
    let balance = principal;
    for (let m = 1; m <= n; m++) {
      const interest = principal * r;
      balance -= principalPerMonth;
      rows.push({
        month: m,
        principal: Math.round(principalPerMonth),
        interest: Math.round(interest),
        payment: Math.round(principalPerMonth + interest),
        balance: Math.max(0, Math.round(balance)),
      });
    }
  } else {
    // Flat Rate
    const total = principal * (1 + r);
    const pmt = total / n;
    const principalPerMonth = principal / n;
    const interestPerMonth = (principal * r) / n;
    let balance = principal;
    for (let m = 1; m <= n; m++) {
      balance -= principalPerMonth;
      rows.push({
        month: m,
        principal: Math.round(principalPerMonth),
        interest: Math.round(interestPerMonth),
        payment: Math.round(pmt),
        balance: Math.max(0, Math.round(balance)),
      });
    }
  }
  return rows;
}
