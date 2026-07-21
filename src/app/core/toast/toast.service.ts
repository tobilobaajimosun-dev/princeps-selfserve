import { Injectable, signal } from '@angular/core';

export type ToastTone = 'success' | 'error' | 'info';

export interface Toast {
  id: number;
  tone: ToastTone;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private nextId = 1;
  private timers = new Map<number, ReturnType<typeof setTimeout>>();
  readonly toasts = signal<Toast[]>([]);

  show(tone: ToastTone, message: string, durationMs = 3600): void {
    const id = this.nextId++;
    this.toasts.update((list) => [...list, { id, tone, message }]);
    const timer = setTimeout(() => this.dismiss(id), durationMs);
    this.timers.set(id, timer);
  }

  success(message: string, durationMs?: number): void { this.show('success', message, durationMs); }
  error(message: string, durationMs?: number): void { this.show('error', message, durationMs ?? 5000); }
  info(message: string, durationMs?: number): void { this.show('info', message, durationMs); }

  dismiss(id: number): void {
    const timer = this.timers.get(id);
    if (timer) { clearTimeout(timer); this.timers.delete(id); }
    this.toasts.update((list) => list.filter((t) => t.id !== id));
  }
}
