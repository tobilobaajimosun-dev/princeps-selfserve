import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TPipe } from '../../../core/i18n/t.pipe';
import { WizardProgressComponent } from '../wizard-progress.component';
import { API_CLIENT } from '../../../core/api/api-client';
import { ApplicationStateService } from '../../../core/application/application-state.service';
import { formatNaira } from '../../../core/money.util';

@Component({
  selector: 'app-submit',
  imports: [TPipe, WizardProgressComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './submit.component.html',
  styleUrl: './submit.component.css',
})
export class SubmitComponent {
  private readonly api = inject(API_CLIENT);
  private readonly state = inject(ApplicationStateService);
  private readonly router = inject(Router);

  readonly contact = this.state.contact;
  readonly employment = this.state.employment;
  readonly offer = this.state.offer;
  readonly agreed = signal(false);
  readonly submitting = signal(false);
  readonly formatNaira = formatNaira;

  readonly canSubmit = computed(() => this.agreed() && !this.submitting());

  constructor() {
    if (!this.state.bvn()?.verified || !this.state.offer()) {
      void this.router.navigateByUrl('/apply/documents');
    }
  }

  toggleAgree(v: boolean): void { this.agreed.set(v); }

  async submit(): Promise<void> {
    if (!this.canSubmit()) return;
    if (this.state.submission().status === 'submitting') return;

    this.submitting.set(true);
    this.state.setSubmission({ status: 'submitting' });
    try {
      const contact = this.state.contact()!;
      const employment = this.state.employment()!;
      const offer = this.state.offer()!;
      const bvn = this.state.bvn()!.value;
      const res = await this.api.submitApplication({
        contact: { phone: contact.phone, email: contact.email },
        employment: { type: employment.type },
        offer: { productId: offer.productId, amount: offer.amount, tenorMonths: offer.tenorMonths },
        bvn,
      });
      const submittedAt = new Date().toISOString();
      if (res.status === 'approved') {
        this.state.setSubmission({ status: 'approved', submittedAt, referenceId: res.referenceId });
      } else if (res.status === 'review') {
        this.state.setSubmission({
          status: 'review', submittedAt, referenceId: res.referenceId, reason: String(res.etaHours),
        });
      } else if (res.status === 'declined') {
        this.state.setSubmission({
          status: 'declined', submittedAt, referenceId: res.referenceId, reason: res.reason,
        });
      } else {
        this.state.setSubmission({
          status: 'disbursement-pending', submittedAt, referenceId: res.referenceId,
        });
      }
      await this.router.navigateByUrl('/apply/status');
    } finally {
      this.submitting.set(false);
    }
  }
}
