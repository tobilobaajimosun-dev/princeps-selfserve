import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-wizard-progress',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="wrap" [attr.aria-label]="ariaLabel()">
      <span class="label">{{ label() }}</span>
      <div class="bar" role="progressbar" [attr.aria-valuenow]="current()" [attr.aria-valuemin]="1" [attr.aria-valuemax]="total()">
        <span class="fill" [style.width.%]="percent()"></span>
      </div>
    </div>
  `,
  styles: [
    `
      .wrap {
        display: flex; flex-direction: column; gap: var(--space-2);
        font-family: var(--font-sans);
      }
      .label {
        font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase;
        color: var(--ink-muted); font-weight: 500;
      }
      .bar {
        height: 3px; background: var(--hairline);
        border-radius: 999px; overflow: hidden;
      }
      .fill {
        display: block; height: 100%; background: var(--ink);
        border-radius: 999px;
        transition: width 320ms cubic-bezier(0.2, 0.7, 0.1, 1);
      }
      @media (prefers-reduced-motion: reduce) {
        .fill { transition: none; }
      }
    `,
  ],
})
export class WizardProgressComponent {
  readonly current = input.required<number>();
  readonly total = input.required<number>();
  readonly label = input<string>('');
  readonly ariaLabel = computed(() => `Step ${this.current()} of ${this.total()}`);
  readonly percent = computed(() => Math.min(100, Math.max(0, (this.current() / this.total()) * 100)));
}
