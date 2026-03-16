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
  styles: [`.card{background:#fff;border:1px solid #e5e7eb;border-radius:1.5rem;padding:1.5rem;display:grid;gap:1rem}.field{display:grid;gap:.4rem}input,textarea{width:100%;border:1px solid #cbd5e1;border-radius:.875rem;padding:.85rem 1rem;font:inherit}textarea{resize:vertical;font-family:ui-monospace,SFMono-Regular,Menlo,monospace}.actions{display:flex;gap:.75rem}button{border:1px solid #111827;background:#111827;color:#fff;border-radius:.875rem;padding:.75rem 1rem;cursor:pointer}.secondary{background:#fff;color:#111827}.error{background:#fff1f2;color:#9f1239;padding:1rem;border-radius:1rem;overflow:auto}`],
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
