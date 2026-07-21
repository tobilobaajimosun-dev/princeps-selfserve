import { Injectable, computed, effect, signal } from '@angular/core';
import { Lang, TRANSLATIONS } from './translations';

const DEFAULT_LANG: Lang = 'en';

@Injectable({ providedIn: 'root' })
export class LangService {
  private readonly _lang = signal<Lang>(DEFAULT_LANG);
  readonly lang = this._lang.asReadonly();
  readonly hasChosen = signal(false);

  private readonly dict = computed(() => TRANSLATIONS[this._lang()]);

  constructor() {
    effect(() => {
      const l = this._lang();
      if (typeof document !== 'undefined') document.documentElement.lang = l;
    });
  }

  set(lang: Lang): void {
    this._lang.set(lang);
    this.hasChosen.set(true);
  }

  t(key: string): string {
    return this.dict()[key] ?? TRANSLATIONS.en[key] ?? key;
  }
}
