import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-header',
  template: `
    <header class="app-header">
      <div class="left">
        <button type="button" class="icon-button hamburger-button" (click)="toggleNav.emit()" aria-label="Toggle navigation menu">
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
        </button>
        <div class="brand">
          <img class="brand-logo" src="/images/auth/absLogoCircle02.png" alt="pocApplication logo" />
          <div class="brand-text">cla-portal</div>
        </div>
      </div>
      <div class="right">
        <span class="welcome">Welcome{{ username() ? ', ' + username() : '' }}</span>
        <button type="button" class="secondary-button" (click)="logout.emit()">Logout</button>
      </div>
    </header>
  `,
  styles: [`.app-header{display:flex;justify-content:space-between;align-items:center;gap:1rem;padding:.875rem 1.25rem;border-bottom:1px solid var(--surface-border);background:var(--surface);position:sticky;top:0;z-index:20}.left,.right{display:flex;align-items:center;gap:.875rem}.brand{display:flex;align-items:center;gap:.75rem}.brand-logo{width:2.25rem;height:2.25rem;object-fit:cover}.brand-text{font-weight:700;color:var(--text-primary)}.icon-button,.secondary-button{border:1px solid var(--button-border);background:var(--button-bg);color:var(--button-text);border-radius:.75rem;padding:.625rem .875rem;cursor:pointer}.hamburger-button{display:grid;gap:.22rem;align-content:center;justify-items:center;min-width:2.75rem;min-height:2.5rem;padding:.5rem}.hamburger-line{display:block;width:1rem;height:2px;border-radius:999px;background:var(--text-primary)}.welcome{color:var(--text-muted)}`],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  readonly username = input<string>('');
  readonly toggleNav = output<void>();
  readonly logout = output<void>();
}
