import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse } from './auth.models';
import { TokenStorageService } from './token-storage.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly tokenStorage = inject(TokenStorageService);

  private readonly tokenSignal = signal<string | null>(this.tokenStorage.getToken());
  private readonly userNameSignal = signal<string>(this.tokenStorage.getUserName() ?? '');
  readonly token = computed(() => this.tokenSignal());
  readonly isAuthenticated = computed(() => !!this.tokenSignal());
  readonly userName = computed(() => this.userNameSignal());

  async login(request: LoginRequest): Promise<void> {
    const response = await firstValueFrom(
      this.http.post<LoginResponse>(`${environment.apiBaseUrl}/api/AS/login`, request)
    );
    const userName = response.USER_NAME?.trim() || response.USER_ID?.trim() || request.USER_ID.trim();

    this.tokenStorage.setToken(response.BearerToken);
    this.tokenStorage.setUserName(userName);
    this.tokenSignal.set(response.BearerToken);
    this.userNameSignal.set(userName);
    await this.router.navigateByUrl('/home');
  }

  async logout(): Promise<void> {
    this.tokenStorage.clearToken();
    this.tokenSignal.set(null);
    this.userNameSignal.set('');
    await this.router.navigateByUrl('/login');
  }
}
