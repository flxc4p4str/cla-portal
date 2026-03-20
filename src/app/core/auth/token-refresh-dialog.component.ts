import { FormsModule } from '@angular/forms';
import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { IgxButtonDirective } from '@infragistics/igniteui-angular/directives';
import { IgxDialogActionsDirective, IgxDialogComponent, IgxDialogTitleDirective } from '@infragistics/igniteui-angular/dialog';
import { IgxInputDirective, IgxInputGroupComponent, IgxLabelDirective } from '@infragistics/igniteui-angular/input-group';

import { TokenRefreshFlowService } from './token-refresh-flow.service';

@Component({
  selector: 'app-token-refresh-dialog',
  imports: [
    FormsModule,
    IgxDialogComponent,
    IgxDialogTitleDirective,
    IgxDialogActionsDirective,
    IgxInputGroupComponent,
    IgxInputDirective,
    IgxLabelDirective,
    IgxButtonDirective,
  ],
  template: `
    <igx-dialog
      [isOpen]="refreshFlow.isOpen()"
      [isModal]="true"
      [closeOnEscape]="false"
      [closeOnOutsideSelect]="false"
      [focusTrap]="true"
    >
      <div igxDialogTitle>Session Expired</div>

      <div class="dialog-body">
        <p class="dialog-copy">
          Your token expired. Enter your password to refresh the session and retry the pending requests.
        </p>

        <igx-input-group>
          <input
            igxInput
            type="text"
            [ngModel]="refreshFlow.userId()"
            readonly
            aria-readonly="true"
          />
          <label igxLabel>User ID</label>
        </igx-input-group>

        <igx-input-group>
          <input
            igxInput
            type="password"
            autocomplete="current-password"
            [ngModel]="password()"
            [disabled]="refreshFlow.isSubmitting()"
            (ngModelChange)="onPasswordChange($event)"
            (keyup.enter)="onRefresh()"
          />
          <label igxLabel>Password</label>
        </igx-input-group>

        @if (validationMessage()) {
          <p class="dialog-error">{{ validationMessage() }}</p>
        }
      </div>

      <div igxDialogActions class="dialog-actions">
        <button type="button" igxButton="flat" [disabled]="refreshFlow.isSubmitting()" (click)="onLogout()">
          Log Out
        </button>
        <button type="button" igxButton="contained" [disabled]="refreshFlow.isSubmitting()" (click)="onRefresh()">
          {{ refreshFlow.isSubmitting() ? 'Refreshing...' : 'Refresh Token' }}
        </button>
      </div>
    </igx-dialog>
  `,
  styles: [`
    :host{display:block}
    .dialog-body{display:flex;flex-direction:column;gap:1rem;min-width:min(28rem,80vw);padding-block:.25rem}
    .dialog-copy{margin:0;color:var(--text-muted)}
    .dialog-error{margin:0;color:var(--app-error);font-size:.9rem}
    .dialog-actions{display:flex;justify-content:flex-end;gap:.75rem}
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TokenRefreshDialogComponent {
  readonly refreshFlow = inject(TokenRefreshFlowService);
  readonly password = signal('');
  readonly validationMessage = signal('');

  constructor() {
    effect(() => {
      if (this.refreshFlow.isOpen()) {
        this.password.set('');
        this.validationMessage.set('');
      }
    });
  }

  onPasswordChange(value: string): void {
    this.password.set(value);
    if (this.validationMessage()) {
      this.validationMessage.set('');
    }
  }

  onRefresh(): void {
    const password = this.password().trim();
    if (!password) {
      this.validationMessage.set('Password is required to refresh the session.');
      return;
    }

    this.validationMessage.set('');
    this.refreshFlow.submitPassword(password);
  }

  onLogout(): void {
    void this.refreshFlow.cancel();
  }
}
