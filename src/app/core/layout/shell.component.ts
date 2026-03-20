import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { Route, Router, RouterOutlet } from '@angular/router';

import { AuthService } from '../auth/auth.service';
import { NavItem } from '../config/nav-item.model';
import { HeaderComponent } from './header.component';
import { SidenavComponent } from './sidenav.component';

type ThemeMode = 'light' | 'dark';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, HeaderComponent, SidenavComponent],
  template: `
    <div class="shell" [attr.data-theme]="theme()">
      <app-header [username]="username()" (toggleNav)="toggleNav()" (logout)="onLogout()" />
      <div class="shell-body">
        <app-sidenav
          [items]="navItems()"
          [collapsed]="navCollapsed()"
          [mobileOpen]="mobileOpen()"
          [isDarkTheme]="isDarkTheme()"
          (toggleTheme)="toggleTheme()"
          (closeMobile)="mobileOpen.set(false)"
        />
        <main class="content"><router-outlet /></main>
      </div>
    </div>
  `,
  styles: [`.shell{min-height:100vh;background:var(--layout-bg);color:var(--text-primary);transition:background-color 180ms ease,color 180ms ease}.shell-body{display:flex;min-height:calc(100vh - 73px)}.content{flex:1;padding:1.5rem;color:var(--text-primary)}@media (max-width:900px){.content{padding:1rem}}`],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShellComponent {
  private readonly themeStorageKey = 'cla-portal-theme';
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  readonly navCollapsed = signal(false);
  readonly mobileOpen = signal(false);
  readonly theme = signal<ThemeMode>(this.readTheme());
  readonly isDarkTheme = computed(() => this.theme() === 'dark');
  readonly username = computed(() => this.authService.userName());
  readonly navItems = computed<NavItem[]>(() => this.readNavItems(this.router.config));

  constructor() {
    effect(() => {
      this.applyIgniteTheme(this.theme());
    });
  }

  toggleNav(): void {
    if (window.innerWidth <= 900) {
      this.mobileOpen.update((value) => !value);
      return;
    }

    this.navCollapsed.update((value) => !value);
  }

  async onLogout(): Promise<void> {
    await this.authService.logout();
  }

  toggleTheme(): void {
    const nextTheme: ThemeMode = this.theme() === 'dark' ? 'light' : 'dark';
    this.theme.set(nextTheme);
    this.persistTheme(nextTheme);
  }

  private readTheme(): ThemeMode {
    if (typeof window === 'undefined') {
      return 'light';
    }

    const savedTheme = window.localStorage.getItem(this.themeStorageKey);
    if (savedTheme === 'dark' || savedTheme === 'light') {
      return savedTheme;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  private persistTheme(theme: ThemeMode): void {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(this.themeStorageKey, theme);
  }

  private applyIgniteTheme(theme: ThemeMode): void {
    const lightTheme = this.document.getElementById('igniteui-theme-light');
    const darkTheme = this.document.getElementById('igniteui-theme-dark');

    if (!(lightTheme instanceof HTMLLinkElement) || !(darkTheme instanceof HTMLLinkElement)) {
      return;
    }

    lightTheme.media = theme === 'light' ? 'all' : 'not all';
    darkTheme.media = theme === 'dark' ? 'all' : 'not all';
  }

  private readNavItems(routes: readonly Route[]): NavItem[] {
       console.log(routes)
    const shell = routes.find((route) => Array.isArray(route.children));
    console.log(shell)
    const children = shell?.children ?? [];
   console.log(children)
    return children
      .filter((route) => !!route.path && !!route.data?.['menuText'])
      .map((route) => ({
        path: `/${route.path ?? ''}`,
        menuText: route.data?.['menuText'], // menuText: String(route.data?.['menuText']),
        icon: route.data?.['icon'] ? String(route.data['icon']) : undefined,
      }));
  }
}
