import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  output,
  signal,
} from '@angular/core';
import { IgxIconModule, IgxTabsModule } from '@infragistics/igniteui-angular';

import { AuthService } from './auth.service';
import { buildGravatarUrl } from './avatar.util';

@Component({
  selector: 'app-user-avatar',
  imports: [IgxTabsModule, IgxIconModule],
  template: `
    <button
      type="button"
      class="avatar-trigger"
      [attr.aria-expanded]="isOpen()"
      aria-haspopup="dialog"
      aria-label="Open user menu"
      (click)="togglePanel()"
    >
      @if (showAvatarImage()) {
        <img
          class="avatar-image"
          [src]="avatarUrl()"
          [alt]="userName() + ' avatar'"
          (error)="handleAvatarError()"
        />
      } @else {
        <span class="avatar-fallback">{{ avatarInitial() }}</span>
      }
    </button>

    <button
      type="button"
      class="drawer-backdrop"
      [class.open]="isOpen()"
      aria-label="Close user panel"
      (click)="closePanel()"
    ></button>

    <aside
      class="drawer"
      [class.open]="isOpen()"
      role="dialog"
      aria-modal="true"
      aria-label="Session and profile"
    >
      <div class="drawer-header">
        <button type="button" class="drawer-close" aria-label="Close user panel" (click)="closePanel()">
          <span class="material-symbols-outlined">close</span>
        </button>
        <div class="drawer-brand">
          <img class="drawer-logo" src="/images/auth/absLogoCircle02.png" alt="Absolution logo" />
          <div class="drawer-brand-copy">
            <span class="drawer-brand-name">cla-portal</span>
            <span class="drawer-brand-caption">Account center</span>
          </div>
        </div>

        <div class="drawer-identity">
          @if (showAvatarImage()) {
            <img
              class="drawer-avatar"
              [src]="avatarUrl()"
              [alt]="userName() + ' avatar'"
              (error)="handleAvatarError()"
            />
          } @else {
            <div class="drawer-avatar drawer-avatar-fallback">{{ avatarInitial() }}</div>
          }

          <div class="identity-copy">
            <strong>{{ userName() }}</strong>
            <span>{{ userEmail() }}</span>
            <span>ID {{ userId() }}</span>
          </div>
        </div>
      </div>

      <div class="drawer-content">
        <igx-tabs>
          <igx-tab-item>
            <igx-tab-header>
              <igx-icon igxTabHeaderIcon fontSet="material-icons">schedule</igx-icon>
              <span igxTabHeaderLabel>Session</span>
            </igx-tab-header>

            <igx-tab-content>
              <section class="panel-section">
                <div class="metric-grid">
                  <div class="metric-card">
                    <span class="metric-label">Session No</span>
                    <strong>{{ sessionNo() || 'Unavailable' }}</strong>
                  </div>
                  <div class="metric-card">
                    <span class="metric-label">Token Expires</span>
                    <strong>{{ expirationLabel() }}</strong>
                  </div>
                  <div class="metric-card metric-card-wide">
                    <span class="metric-label">Countdown</span>
                    <strong>{{ expirationCountdown() }}</strong>
                  </div>
                </div>
              </section>
            </igx-tab-content>
          </igx-tab-item>

          <igx-tab-item>
            <igx-tab-header>
              <igx-icon igxTabHeaderIcon fontSet="material-icons">verified_user</igx-icon>
              <span igxTabHeaderLabel>Security</span>
            </igx-tab-header>

            <igx-tab-content>
              <section class="panel-section">
                <div class="section-heading">Security Codes</div>

                @if (securityCodes().length) {
                  <div class="security-list">
                    @for (code of securityCodes(); track code) {
                      <div class="security-code">{{ code }}</div>
                    }
                  </div>
                } @else {
                  <p class="empty-state">No security codes were returned for this session.</p>
                }
              </section>
            </igx-tab-content>
          </igx-tab-item>

          <igx-tab-item>
            <igx-tab-header>
              <igx-icon igxTabHeaderIcon fontSet="material-icons">person</igx-icon>
              <span igxTabHeaderLabel>Profile</span>
            </igx-tab-header>

            <igx-tab-content>
              <section class="panel-section">
                <p class="empty-state">Profile details will be added here.</p>
              </section>
            </igx-tab-content>
          </igx-tab-item>
        </igx-tabs>
      </div>

      <div class="drawer-footer">
        <button type="button" class="logout-button" (click)="requestLogout()">
          <span class="material-symbols-outlined">logout</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  `,
  styles: [`
    :host {
      display: contents;
    }

    .avatar-trigger {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 2.75rem;
      height: 2.75rem;
      border: 1px solid var(--surface-border);
      border-radius: 999px;
      background: var(--surface);
      color: var(--text-primary);
      box-shadow: 0 10px 28px rgba(15, 23, 42, 0.08);
      cursor: pointer;
      overflow: hidden;
      transition: transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease;
    }

    .avatar-trigger:hover {
      transform: translateY(-1px);
      border-color: color-mix(in srgb, var(--nav-active-bg) 45%, var(--surface-border));
      box-shadow: 0 14px 30px rgba(15, 23, 42, 0.12);
    }

    .avatar-image,
    .drawer-avatar {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .avatar-fallback,
    .drawer-avatar-fallback {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      font-size: 0.95rem;
      font-weight: 700;
      letter-spacing: 0.04em;
      color: #fff6eb;
      background:
        radial-gradient(circle at top, rgba(255, 255, 255, 0.2), transparent 58%),
        linear-gradient(135deg, color-mix(in srgb, var(--nav-bg) 86%, black), var(--nav-active-bg));
    }

    .drawer-backdrop {
      position: fixed;
      inset: 0;
      border: 0;
      background: rgba(15, 23, 42, 0.32);
      opacity: 0;
      pointer-events: none;
      transition: opacity 180ms ease;
      z-index: 39;
    }

    .drawer-backdrop.open {
      opacity: 1;
      pointer-events: auto;
    }

    .drawer {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      width: min(26rem, calc(100vw - 1rem));
      display: grid;
      grid-template-rows: auto minmax(0, 1fr) auto;
      background: var(--surface);
      border-left: 1px solid var(--surface-border);
      box-shadow: -18px 0 48px rgba(15, 23, 42, 0.18);
      transform: translateX(100%);
      transition: transform 220ms ease;
      z-index: 40;
      overflow: hidden;
    }

    .drawer.open {
      transform: translateX(0);
    }

    .drawer-header {
      position: relative;
      display: grid;
      gap: 1.25rem;
      padding: 1.5rem 1.5rem 1.25rem;
      color: #6a221c;
      background:
        radial-gradient(circle at top right, rgba(190, 70, 58, 0.1), transparent 30%),
        linear-gradient(160deg, #fff8f6 0%, #fdecea 54%, #f6ddd8 100%);
      border-bottom: 1px solid color-mix(in srgb, var(--nav-active-bg) 18%, var(--surface-border));
    }

    .drawer-close {
      position: absolute;
      top: 1rem;
      right: 1rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 2.25rem;
      height: 2.25rem;
      border: 1px solid rgba(138, 47, 38, 0.16);
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.68);
      color: #8a2f26;
      cursor: pointer;
    }

    .drawer-brand {
      display: flex;
      align-items: center;
      gap: 0.875rem;
      padding-right: 2.5rem;
    }

    .drawer-logo {
      width: 3rem;
      height: 3rem;
      object-fit: cover;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.96);
      padding: 0.125rem;
      box-shadow: 0 10px 24px rgba(106, 34, 28, 0.08);
    }

    .drawer-brand-copy,
    .identity-copy {
      display: grid;
      gap: 0.2rem;
    }

    .drawer-brand-name {
      font-size: 1.1rem;
      font-weight: 700;
      line-height: 1.2;
      color: #7c271f;
    }

    .drawer-brand-caption,
    .identity-copy span {
      font-size: 0.875rem;
      color: rgba(106, 34, 28, 0.72);
    }

    .drawer-identity {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      border-radius: 1.25rem;
      background: rgba(255, 255, 255, 0.74);
      border: 1px solid rgba(138, 47, 38, 0.1);
      box-shadow: 0 16px 32px rgba(106, 34, 28, 0.08);
    }

    .drawer-avatar {
      width: 4rem;
      height: 4rem;
      border-radius: 999px;
      overflow: hidden;
      flex: 0 0 auto;
      box-shadow: 0 14px 30px rgba(15, 23, 42, 0.18);
    }

    .identity-copy strong {
      font-size: 1rem;
      line-height: 1.2;
      color: #6a221c;
    }

    .drawer-content {
      min-height: 0;
      overflow: auto;
      background:
        linear-gradient(180deg, color-mix(in srgb, var(--surface-soft) 65%, white), transparent 8rem),
        var(--surface);
    }

    .drawer-footer {
      padding: 1rem 1.25rem 1.25rem;
      border-top: 1px solid var(--surface-border);
      background:
        linear-gradient(180deg, rgba(255, 255, 255, 0.72), rgba(255, 255, 255, 0.98)),
        var(--surface);
    }

    igx-tabs {
      display: block;
      color: var(--text-primary);
      background: transparent;
    }

    igx-tab-header {
      color: var(--text-primary);
    }

    .panel-section {
      display: grid;
      gap: 1rem;
      padding: 1.25rem;
    }

    .metric-grid {
      display: grid;
      gap: 0.875rem;
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .metric-card {
      display: grid;
      gap: 0.375rem;
      padding: 1rem;
      border: 1px solid var(--surface-border);
      border-radius: 1rem;
      background: color-mix(in srgb, var(--surface-soft) 72%, white);
      color: var(--text-primary);
    }

    .metric-card-wide {
      grid-column: 1 / -1;
    }

    .metric-label,
    .section-heading {
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--text-muted);
    }

    .metric-card strong {
      font-size: 0.95rem;
      line-height: 1.45;
    }

    .logout-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      width: 100%;
      min-height: 3rem;
      border: 1px solid color-mix(in srgb, var(--nav-active-bg) 58%, transparent);
      border-radius: calc(var(--app-radius) * 1.1);
      background: linear-gradient(135deg, #8a2f26, #b6463b);
      color: #fff6f0;
      font: inherit;
      font-weight: 600;
      letter-spacing: 0.01em;
      padding: 0.8rem 1rem;
      box-shadow: 0 16px 30px rgba(122, 39, 31, 0.24);
      cursor: pointer;
      transition: transform 160ms ease, box-shadow 160ms ease, filter 160ms ease;
    }

    .logout-button:hover {
      transform: translateY(-1px);
      filter: saturate(1.03);
      box-shadow: 0 18px 32px rgba(122, 39, 31, 0.28);
    }

    .security-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.625rem;
    }

    .security-code {
      padding: 0.5rem 0.75rem;
      border: 1px solid var(--surface-border);
      border-radius: 999px;
      background: color-mix(in srgb, var(--surface-soft) 76%, white);
      color: var(--text-primary);
      font-size: 0.9rem;
      font-weight: 600;
    }

    .empty-state {
      margin: 0;
      color: var(--text-muted);
      line-height: 1.5;
    }

    .material-symbols-outlined {
      font-size: 1.2rem;
    }

    @media (max-width: 720px) {
      .drawer {
        width: calc(100vw - 0.25rem);
      }

      .metric-grid {
        grid-template-columns: minmax(0, 1fr);
      }

      .metric-card-wide {
        grid-column: auto;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserAvatarComponent {
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  readonly logout = output<void>();

  readonly isOpen = signal(false);
  readonly failedAvatarKey = signal<string | null>(null);
  private readonly now = signal(Date.now());

  readonly userName = this.authService.userName;
  readonly userId = this.authService.userId;
  readonly userEmail = this.authService.userEmail;
  readonly sessionNo = this.authService.sessionNo;
  readonly securityCodes = this.authService.securityCodes;
  readonly tokenExpiresAt = this.authService.tokenExpiresAt;

  readonly avatarKey = computed(() => this.userEmail().trim().toLowerCase());
  readonly avatarUrl = computed(() => buildGravatarUrl(this.userEmail()));
  readonly avatarInitial = computed(() => {
    const source = this.userName().trim() || this.userId().trim() || this.userEmail().trim();
    return source.charAt(0).toUpperCase() || '?';
  });
  readonly showAvatarImage = computed(() => !!this.avatarUrl() && this.failedAvatarKey() !== this.avatarKey());
  readonly expirationLabel = computed(() => {
    const expirationDate = this.expirationDate();
    return expirationDate ? expirationDate.toLocaleString() : 'Unavailable';
  });
  readonly expirationCountdown = computed(() => {
    const expirationDate = this.expirationDate();
    if (!expirationDate) {
      return 'Unavailable';
    }

    const remainingMs = expirationDate.getTime() - this.now();
    if (remainingMs <= 0) {
      return 'Expired';
    }

    const totalSeconds = Math.floor(remainingMs / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const timePart = [hours, minutes, seconds].map((value) => value.toString().padStart(2, '0')).join(':');
    return days > 0 ? `${days}d ${timePart}` : timePart;
  });

  constructor() {
    const timerId = window.setInterval(() => this.now.set(Date.now()), 1000);
    this.destroyRef.onDestroy(() => window.clearInterval(timerId));
  }

  togglePanel(): void {
    this.isOpen.update((currentValue) => !currentValue);
  }

  closePanel(): void {
    this.isOpen.set(false);
  }

  handleAvatarError(): void {
    this.failedAvatarKey.set(this.avatarKey());
  }

  requestLogout(): void {
    this.closePanel();
    this.logout.emit();
  }

  private expirationDate(): Date | null {
    const rawValue = this.tokenExpiresAt().trim();
    if (!rawValue) {
      return null;
    }

    const parsedValue = new Date(rawValue);
    return Number.isNaN(parsedValue.getTime()) ? null : parsedValue;
  }
}
