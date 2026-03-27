import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IgxButtonDirective } from '@infragistics/igniteui-angular/directives';
import { IgxInputDirective, IgxInputGroupComponent, IgxLabelDirective } from '@infragistics/igniteui-angular/input-group';

import { AuthService } from '../../core/auth/auth.service';

interface LoginModel {
  USER_ID: string;
  USER_PASSWORD: string;
}

@Component({
  selector: 'app-login',
  imports: [FormsModule, IgxInputGroupComponent, IgxInputDirective, IgxLabelDirective, IgxButtonDirective],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly isSubmitting = signal(false);
  readonly errorMessage = signal('');
  readonly model = signal<LoginModel>({ USER_ID: '', USER_PASSWORD: '' });
  readonly submitAttempted = signal(false);

  constructor() {
    if (this.authService.isAuthenticated()) {
      // void this.router.navigateByUrl('/api-test'); // navigate to api-test page if it turns out that the user is already authenticated
      void this.router.navigateByUrl('/home');
    }
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    this.submitAttempted.set(true);
    this.errorMessage.set('');

    const credentials = this.model();
    if (!credentials.USER_ID.trim() || !credentials.USER_PASSWORD.trim()) {
      return;
    }

    this.isSubmitting.set(true);
    void this.authService
      .login(credentials)
      .catch((e:any) => {
        // this.errorMessage.set('Login failed. Check your API endpoint and credentials.');
        console.log(e)
        this.errorMessage.set(e.error || (e.message || 'Login failed. Check your API endpoint and credentials.'));        
      })
      .finally(() => {
        this.isSubmitting.set(false);
      });
  }

  updateField(field: keyof LoginModel, value: string): void {
    this.model.update((current) => ({ ...current, [field]: value }));
  }
}
