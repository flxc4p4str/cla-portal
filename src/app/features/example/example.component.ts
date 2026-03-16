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
  styles: [`.card{background:#fff;border:1px solid #e5e7eb;border-radius:1.5rem;padding:1.5rem}button{margin-top:1rem;border:1px solid #d1d5db;background:#111827;color:#fff;border-radius:.875rem;padding:.75rem 1rem;cursor:pointer}`],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExampleComponent {
  readonly count = signal(0);
}
