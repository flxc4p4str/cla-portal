// import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  model,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-example',
  imports: [FormsModule],
  template: `
    <section class="card">
      <h2>Example Component</h2>
      <p>This is an empty prototype-ready component.</p>
      <button type="button" (click)="count.update((value) => value + 1)">Clicked {{ count() }} times</button>
    </section>

    <section class="flex gap-5">
      <p>Testing effect (Do Not Use)</p>
    </section>

    <section>
      <div>
        <input type="checkbox" [(ngModel)]="drive" />
        +500 GB drive-space
      </div>
      <div>
        <input type="checkbox" [(ngModel)]="ram" />
        +4 GB RAM
      </div>
      <div>
        <input type="checkbox" [(ngModel)]="gpu" />
        Better GPU
      </div>
    </section>
  `,
  styles: [`.card{background:var(--surface);border:1px solid var(--surface-border);border-radius:var(--app-radius);padding:1.5rem;color:var(--text-primary)}p{color:var(--text-muted)}button{margin-top:1rem;border:1px solid var(--app-brand);background:var(--app-brand);color:var(--app-brand-contrast);border-radius:var(--app-radius);padding:.75rem 1rem;cursor:pointer}`],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExampleComponent {
  readonly count = signal(0);

  // https://medium.com/ngconf/debugging-angular-signals-a-guide-to-the-signal-graph-devtool-b0b69804496d
  
  drive = model(false);
  ram = model(false);
  gpu = model(false);

  constructor() {
    /* 
      Explain for your junior team mate why this bug occurs ...
    */
    effect(() => {
      if (this.drive() || this.ram() || this.gpu()) {
        // alert('Price increased!')
        console.log('Price increased!')
      }
    });

    effect(() => {
      // Read all signals upfront to register them as dependencies
      const drive = this.drive();
      const ram = this.ram();
      const gpu = this.gpu();

      if (drive || ram || gpu) {
        alert('Price increased!');
      }
    });

  }

}
