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
  styles: [`.page{display:grid;gap:1rem}.hero{background:#fff;border:1px solid #e5e7eb;border-radius:1.5rem;padding:2rem;box-shadow:0 10px 30px rgba(15,23,42,.04)}.eyebrow{text-transform:uppercase;letter-spacing:.08em;color:#6366f1;font-weight:700;font-size:.75rem}h1{margin:.25rem 0 .5rem;font-size:2rem}.lede{color:#4b5563;max-width:48rem}`],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {}
