import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TPipe } from '../../../core/i18n/t.pipe';
import { ApplicationStateService } from '../../../core/application/application-state.service';
import { AGENTS, OFFICES } from '../../../core/directory/contacts';

const PRINCEPS_WHATSAPP = '2348030000000';

@Component({
  selector: 'app-status',
  imports: [TPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './status.component.html',
  styleUrl: './status.component.css',
})
export class StatusComponent {
  private readonly state = inject(ApplicationStateService);
  private readonly router = inject(Router);

  readonly submission = this.state.submission;
  readonly agents = AGENTS;
  readonly offices = OFFICES;
  readonly telHref = (phone: string): string => `tel:${phone.replace(/\s+/g, '')}`;

  readonly whatsappHref = computed(() => {
    const s = this.submission();
    const ref = s.referenceId ?? '';
    const message = ref
      ? `Hi Princeps, please send WhatsApp updates for my application ${ref}.`
      : `Hi Princeps, please send WhatsApp updates for my application.`;
    return `https://wa.me/${PRINCEPS_WHATSAPP}?text=${encodeURIComponent(message)}`;
  });

  readonly showWhatsapp = computed(() => {
    const s = this.submission().status;
    return s === 'approved' || s === 'review' || s === 'disbursement-pending';
  });

  readonly titleKey = computed(() => `status.${this.baseKey()}.title`);
  readonly bodyKey = computed(() => `status.${this.baseKey()}.body`);
  readonly bodyParams = computed<Record<string, string | number> | undefined>(() => {
    const s = this.submission();
    if (s.status === 'review') return { hours: s.reason ?? '24' } as Record<string, string | number>;
    if (s.status === 'declined') return { reason: s.reason ?? '' } as Record<string, string | number>;
    return undefined;
  });

  private baseKey(): string {
    const status = this.submission().status;
    if (status === 'disbursement-pending') return 'disbursement';
    return status;
  }

  constructor() {
    if (this.submission().status === 'idle') {
      void this.router.navigateByUrl('/apply/submit');
    }
  }

  done(): void {
    this.state.reset();
    void this.router.navigateByUrl('/');
  }
}
