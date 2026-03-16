import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { NavItem } from '../config/nav-item.model';

@Component({
  selector: 'app-sidenav',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside class="backdrop" [class.visible]="mobileOpen()" (click)="closeMobile.emit()"></aside>
    <nav class="sidenav" [class.collapsed]="collapsed()" [class.mobile-open]="mobileOpen()">
      <div class="menu-header">
        <div class="menu-title">Navigation</div>
        <button
          type="button"
          class="theme-toggle"
          (click)="toggleTheme.emit()"
          [attr.aria-label]="isDarkTheme() ? 'Switch to light mode' : 'Switch to dark mode'"
        >
          {{ isDarkTheme() ? 'Light' : 'Dark' }}
        </button>
      </div>
      @for (item of items(); track item.path) {
        <a class="menu-link" [routerLink]="item.path" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: item.path === '/home' }" (click)="closeMobile.emit()">
          @if (!collapsed() || mobileOpen()) {<span>{{ item.menuText }}</span> }
        </a>
      }
    </nav>
  `,
  styles: [`:host{display:block}.backdrop{display:none}.sidenav{width:16rem;background:var(--nav-bg);color:var(--nav-text);padding:1rem .75rem;transition:transform 180ms ease;overflow:auto;height:100%}.sidenav.collapsed{display:none}.menu-header{display:flex;align-items:center;justify-content:space-between;gap:.5rem;padding:.4rem .5rem .85rem}.menu-title{font-size:.75rem;text-transform:uppercase;letter-spacing:.08em;color:var(--nav-muted)}.theme-toggle{border:1px solid var(--button-border);background:var(--button-bg);color:var(--button-text);border-radius:.6rem;padding:.35rem .6rem;font-size:.72rem;font-weight:600;cursor:pointer}.menu-link{display:flex;align-items:center;gap:.75rem;color:inherit;text-decoration:none;padding:.875rem .75rem;border-radius:.875rem;margin-bottom:.375rem}.menu-link:hover,.menu-link.active{background:var(--nav-hover)}.menu-icon{width:1.75rem;text-align:center}@media (max-width:900px){.backdrop.visible{display:block;position:fixed;inset:0;background:var(--backdrop);z-index:25}.sidenav{display:block;position:fixed;left:0;top:0;bottom:0;transform:translateX(-100%);z-index:30;width:18rem}.sidenav.collapsed{display:none;width:18rem}.sidenav.mobile-open,.sidenav.collapsed.mobile-open{display:block;transform:translateX(0)}}`],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidenavComponent {
  readonly items = input<NavItem[]>([]);
  readonly collapsed = input(false);
  readonly mobileOpen = input(false);
  readonly isDarkTheme = input(false);
  readonly toggleTheme = output<void>();
  readonly closeMobile = output<void>();
}
