import { ChangeDetectionStrategy, Component, linkedSignal, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-api-test',
  imports: [FormsModule],
  template: `
    <section class="card">
      <h2>API Test Component</h2>
      <p>Paste a URL and run a GET request using <code>httpResource</code>.</p>
      <label class="field">
        <span>Request URL</span>
        <input type="url" [ngModel]="urlInput()" (ngModelChange)="urlInput.set($event)" placeholder="https://absapi.absolution1.com/health" />
      </label>
      <div class="actions">
        <button type="button" (click)="submittedUrl.set(urlInput().trim())">Run GET</button>
        <button type="button" class="secondary" (click)="clear()">Clear</button>
      </div>
      @if (resource.isLoading()) { <p>Loading...</p> }
      @if (errorText()) { <pre class="error">{{ errorText() }}</pre> }
      @if (formattedResponse()) {
        <label class="field">
          <span>JSON Response</span>
          <textarea rows="18" [value]="formattedResponse()" readonly></textarea>
        </label>
      }
    </section>
  `,
  styles: [`.card{background:var(--surface);border:1px solid var(--surface-border);border-radius:var(--app-radius);padding:1.5rem;display:grid;gap:1rem;color:var(--text-primary)}p{color:var(--text-muted)}.field{display:grid;gap:.4rem}input,textarea{width:100%;border:1px solid var(--surface-border);background:var(--app-surface-soft);color:var(--text-primary);border-radius:var(--app-radius);padding:.85rem 1rem;font:inherit}textarea{resize:vertical;font-family:ui-monospace,SFMono-Regular,Menlo,monospace}.actions{display:flex;gap:.75rem}button{border:1px solid var(--app-brand);background:var(--app-brand);color:var(--app-brand-contrast);border-radius:var(--app-radius);padding:.75rem 1rem;cursor:pointer}.secondary{background:var(--button-bg);border-color:var(--button-border);color:var(--button-text)}.error{background:var(--app-error-bg);color:var(--app-error);padding:1rem;border:1px solid var(--app-error-border);border-radius:var(--app-radius);overflow:auto}`],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApiTestComponent {
  readonly urlInput = signal('https://absapi.absolution1.com/api/Home/Persons');
  readonly submittedUrl = signal('');
  readonly request = linkedSignal(() => {
    const url = this.submittedUrl();
    return url ? { url } : undefined;
  });
  readonly resource = httpResource<unknown>(() => this.request());
  readonly formattedResponse = linkedSignal(() => {
    const value = this.resource.value();
    return value ? JSON.stringify(value, null, 2) : '';
  });
  readonly errorText = linkedSignal(() => {
    const error = this.resource.error();
    return error ? String(error) : '';
  });

  clear(): void {
    this.urlInput.set('');
    this.submittedUrl.set('');
  }
}
