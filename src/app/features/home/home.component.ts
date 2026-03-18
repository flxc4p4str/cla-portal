import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-home',
  template: `
    <section class="page">
      <div class="hero">
        <div>
          <p class="eyebrow">Starter dashboard</p>
          <h1>Welcome to cla-portal</h1>
          <p class="lede">Use this shell to prototype secured Angular SaaS pages quickly.</p>
        </div>
      </div>
    </section>
  `,
  styles: [`.page{display:grid;gap:1rem}.hero{background:var(--surface);border:1px solid var(--surface-border);border-radius:var(--app-radius);padding:2rem;box-shadow:var(--app-shadow)}.eyebrow{text-transform:uppercase;letter-spacing:.08em;color:var(--app-brand-strong);font-weight:700;font-size:.75rem}h1{margin:.25rem 0 .5rem;font-size:2rem;color:var(--text-primary)}.lede{color:var(--text-muted);max-width:48rem}`],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {}
