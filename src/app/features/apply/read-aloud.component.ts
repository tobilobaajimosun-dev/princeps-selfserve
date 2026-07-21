import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { LangService } from '../../core/i18n/lang.service';

const VOICE_LOCALE: Record<string, string> = {
  en: 'en-NG',
  yo: 'yo-NG',
  ig: 'ig-NG',
  ha: 'ha-NG',
};

@Component({
  selector: 'app-read-aloud',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      class="tts"
      (click)="toggle()"
      [class.is-speaking]="speaking()"
      [attr.aria-pressed]="speaking()"
      [attr.aria-label]="speaking() ? 'Stop reading' : 'Read this screen aloud'"
      [attr.title]="speaking() ? 'Stop' : 'Read aloud'"
    >
      @if (speaking()) {
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="6" y="6" width="4" height="12" rx="1" fill="currentColor"/>
          <rect x="14" y="6" width="4" height="12" rx="1" fill="currentColor"/>
        </svg>
      } @else {
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 9v6h4l5 4V5L8 9H4z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
          <path d="M16 8a5 5 0 0 1 0 8M19 5a9 9 0 0 1 0 14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
        </svg>
      }
    </button>
  `,
  styles: [
    `
      .tts {
        display: inline-flex; align-items: center; justify-content: center;
        width: 36px; height: 36px;
        background: transparent; border: 1px solid var(--hairline);
        color: var(--ink); border-radius: 50%;
        cursor: pointer;
        transition: background 160ms ease, color 160ms ease, border-color 160ms ease;
      }
      .tts:hover { background: rgba(17,17,17,0.06); }
      .tts:focus-visible { outline: none; box-shadow: var(--focus-ring); }
      .tts.is-speaking {
        background: var(--action-primary);
        color: var(--action-on-primary);
        border-color: var(--action-primary);
      }
    `,
  ],
})
export class ReadAloudComponent {
  private readonly lang = inject(LangService);
  readonly speaking = signal(false);

  toggle(): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const synth = window.speechSynthesis;
    if (this.speaking()) {
      synth.cancel();
      this.speaking.set(false);
      return;
    }
    const text = this.collectVisibleText();
    if (!text) return;
    synth.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = VOICE_LOCALE[this.lang.lang()] ?? 'en-NG';
    utter.rate = 1;
    utter.pitch = 1;
    utter.onend = () => this.speaking.set(false);
    utter.onerror = () => this.speaking.set(false);
    this.speaking.set(true);
    synth.speak(utter);
  }

  private collectVisibleText(): string {
    if (typeof document === 'undefined') return '';
    const main = document.querySelector('main.body') ?? document.querySelector('main');
    if (!main) return '';
    const parts: string[] = [];
    main
      .querySelectorAll<HTMLElement>(
        'h1, h2, h3, p, label, .eyebrow, .subtitle, dd, dt, li, button',
      )
      .forEach((el) => {
        if (el.offsetParent === null) return;
        const t = (el.innerText ?? '').trim();
        if (t) parts.push(t);
      });
    return parts.join('. ');
  }
}
