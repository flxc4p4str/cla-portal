import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
  selector: 'app-example',
  template: `
    <section class="card">
      <h2>Example Component</h2>
      <p>This is an empty prototype-ready component.</p>
      <button type="button" (click)="count.update((value) => value + 1)">Clicked {{ count() }} times</button>
    </section>
  `,
  styles: [`.card{background:var(--surface);border:1px solid var(--surface-border);border-radius:var(--app-radius);padding:1.5rem;color:var(--text-primary)}p{color:var(--text-muted)}button{margin-top:1rem;border:1px solid var(--app-brand);background:var(--app-brand);color:var(--app-brand-contrast);border-radius:var(--app-radius);padding:.75rem 1rem;cursor:pointer}`],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExampleComponent {
  readonly count = signal(0);
}
