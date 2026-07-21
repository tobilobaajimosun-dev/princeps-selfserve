import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TPipe } from '../../../core/i18n/t.pipe';
import { WizardProgressComponent } from '../wizard-progress.component';
import { ApplicationStateService } from '../../../core/application/application-state.service';
import { formatNaira } from '../../../core/money.util';

@Component({
  selector: 'app-mandate',
  imports: [TPipe, WizardProgressComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './mandate.component.html',
  styleUrl: './mandate.component.css',
})
export class MandateComponent {
  private readonly state = inject(ApplicationStateService);
  private readonly router = inject(Router);

  readonly offer = this.state.offer;
  readonly salary = this.state.salary;
  readonly agreed = signal(false);
  readonly formatNaira = formatNaira;

  readonly channelKey = computed(() => {
    const c = this.salary()?.channel;
    if (c === 'ippis') return 'step.mandate.channel.ippis';
    if (c === 'remita') return 'step.mandate.channel.remita';
    return 'step.mandate.channel.dedukt';
  });

  readonly monthlyRepayment = computed(() => this.offer()?.monthlyRepayment ?? 0);
  readonly tenorMonths = computed(() => this.offer()?.tenorMonths ?? 0);

  constructor() {
    if (!this.offer()) {
      void this.router.navigateByUrl('/apply/offers');
    }
  }

  toggleAgree(v: boolean): void {
    this.agreed.set(v);
  }

  authorize(): void {
    if (!this.agreed()) return;
    const o = this.offer();
    const s = this.salary();
    if (!o || !s) return;
    this.state.setMandate({
      authorized: true,
      channel: s.channel,
      monthlyAmount: o.monthlyRepayment,
      tenorMonths: o.tenorMonths,
      authorizedAt: new Date().toISOString(),
    });
    void this.router.navigateByUrl('/apply/documents');
  }
}
