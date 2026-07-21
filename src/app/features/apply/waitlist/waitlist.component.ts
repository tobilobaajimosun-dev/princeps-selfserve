import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TPipe } from '../../../core/i18n/t.pipe';
import { API_CLIENT } from '../../../core/api/api-client';
import { ApplicationStateService } from '../../../core/application/application-state.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-waitlist',
  imports: [TPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './waitlist.component.html',
  styleUrl: './waitlist.component.css',
})
export class WaitlistComponent {
  private readonly api = inject(API_CLIENT);
  private readonly state = inject(ApplicationStateService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private readonly params = toSignal(this.route.queryParamMap, {
    initialValue: this.route.snapshot.queryParamMap,
  });
  readonly submitting = signal(false);
  readonly joined = signal(false);

  async join(): Promise<void> {
    if (this.joined() || this.submitting()) return;
    const contact = this.state.contact();
    if (!contact) {
      await this.router.navigateByUrl('/apply/contact');
      return;
    }
    this.submitting.set(true);
    try {
      await this.api.joinWaitlist({
        phone: contact.phone,
        email: contact.email,
        type: this.params().get('type') ?? 'unknown',
      });
      this.joined.set(true);
    } finally {
      this.submitting.set(false);
    }
  }

  home(): void {
    void this.router.navigateByUrl('/');
  }
}
