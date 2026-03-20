import { HttpEvent } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';

import { LoginRequest } from './auth.models';
import { AuthService } from './auth.service';

interface RefreshDialogState {
  isOpen: boolean;
  isSubmitting: boolean;
  userId: string;
}

type RetryOperation = () => Observable<HttpEvent<unknown>>;

interface QueuedRetry {
  execute: RetryOperation;
  subscriber: Subscriber<HttpEvent<unknown>>;
}

function createIdleState(): RefreshDialogState {
  return {
    isOpen: false,
    isSubmitting: false,
    userId: '',
  };
}

@Injectable({ providedIn: 'root' })
export class TokenRefreshFlowService {
  private readonly authService = inject(AuthService);
  private readonly dialogStateSignal = signal<RefreshDialogState>(createIdleState());
  private readonly retryQueue: QueuedRetry[] = [];

  readonly isOpen = computed(() => this.dialogStateSignal().isOpen);
  readonly isSubmitting = computed(() => this.dialogStateSignal().isSubmitting);
  readonly userId = computed(() => this.dialogStateSignal().userId);

  isRefreshPending(): boolean {
    const state = this.dialogStateSignal();
    return state.isOpen || state.isSubmitting;
  }

  startRefreshFlow(): boolean {
    if (this.isRefreshPending()) {
      return true;
    }

    const userId = this.authService.userId().trim();
    if (!userId) {
      return false;
    }

    this.dialogStateSignal.set({
      isOpen: true,
      isSubmitting: false,
      userId,
    });

    return true;
  }

  queueRetry(operation: RetryOperation): Observable<HttpEvent<unknown>> {
    return new Observable<HttpEvent<unknown>>((subscriber) => {
      const entry: QueuedRetry = { execute: operation, subscriber };
      this.retryQueue.push(entry);

      return () => {
        const index = this.retryQueue.indexOf(entry);
        if (index >= 0) {
          this.retryQueue.splice(index, 1);
        }
      };
    });
  }

  submitPassword(password: string): void {
    const credentials: LoginRequest = {
      USER_ID: this.userId(),
      USER_PASSWORD: password.trim(),
    };

    if (!credentials.USER_ID || !credentials.USER_PASSWORD || this.isSubmitting()) {
      return;
    }

    this.dialogStateSignal.update((state) => ({ ...state, isSubmitting: true }));

    void this.authService
      .refreshToken(credentials)
      .then(() => {
        this.dialogStateSignal.set(createIdleState());
        this.flushRetryQueue();
      })
      .catch((error) => {
        void this.failRefresh(error);
      });
  }

  cancel(): Promise<void> {
    return this.failRefresh(new Error('Session refresh was cancelled.'));
  }

  private flushRetryQueue(): void {
    const pendingRetries = this.retryQueue.splice(0);

    for (const pendingRetry of pendingRetries) {
      pendingRetry.execute().subscribe(pendingRetry.subscriber);
    }
  }

  private async failRefresh(error: unknown): Promise<void> {
    const pendingRetries = this.retryQueue.splice(0);
    this.dialogStateSignal.set(createIdleState());

    for (const pendingRetry of pendingRetries) {
      pendingRetry.subscriber.error(error);
    }

    await this.authService.logout();
  }
}
