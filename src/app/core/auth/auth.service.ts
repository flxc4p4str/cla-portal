import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse } from './auth.models';
import { TokenStorageService } from './token-storage.service';

const DEFAULT_USER_EMAIL = 'rdw@absolution.com';

function parseJwtExpiration(token: string): string | null {
  const tokenParts = token.split('.');
  if (tokenParts.length < 2) {
    return null;
  }

  try {
    const base64 = tokenParts[1].replace(/-/g, '+').replace(/_/g, '/');
    const payloadJson = atob(base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '='));
    const payload = JSON.parse(payloadJson) as { exp?: number };
    return typeof payload.exp === 'number' ? new Date(payload.exp * 1000).toISOString() : null;
  } catch {
    return null;
  }
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly tokenStorage = inject(TokenStorageService);

  private readonly tokenSignal = signal<string | null>(this.tokenStorage.getToken());
  private readonly userNameSignal = signal<string>(this.tokenStorage.getUserName() ?? '');
  private readonly userIdSignal = signal<string>(this.tokenStorage.getUserId() ?? '');
  private readonly sessionNoSignal = signal<string>(this.tokenStorage.getSessionNo() ?? '');
  private readonly userEmailSignal = signal<string>(this.tokenStorage.getUserEmail() ?? DEFAULT_USER_EMAIL);
  private readonly securityCodesSignal = signal<string[]>(this.tokenStorage.getSecurityCodes());
  private readonly tokenExpiresAtSignal = signal<string>(this.tokenStorage.getExpiresUtc() ?? '');
  readonly token = computed(() => this.tokenSignal());
  readonly isAuthenticated = computed(() => !!this.tokenSignal());
  readonly userName = computed(() => this.userNameSignal());
  readonly userId = computed(() => this.userIdSignal());
  readonly sessionNo = computed(() => this.sessionNoSignal());
  readonly userEmail = computed(() => this.userEmailSignal() || DEFAULT_USER_EMAIL);
  readonly securityCodes = computed(() => this.securityCodesSignal());
  readonly tokenExpiresAt = computed(() => this.tokenExpiresAtSignal());

  async login(request: LoginRequest): Promise<void> {
    console.log('Login 1 successful, navigating to home page...');
    const response = await this.authenticate(request);
    console.log('Login 2 successful,',response);
    if (response.USER_ID === 'wjz2') {
      throw new Error('Bad Boy: ' + response.USER_NAME);
    }
    this.applyAuthenticatedSession(response, request.USER_ID);
    console.log('Login 3 successful, navigating to home page...');
    // await this.router.navigateByUrl('/example'); // navigate to example page after login for testing purposes
    console.log('Login 4 successful, navigating to home page...');
    await this.router.navigateByUrl('/home');    
  }

  async refreshToken(request: LoginRequest): Promise<void> {
    const response = await this.authenticate(request);
    this.applyAuthenticatedSession(response, request.USER_ID);
  }

  async logout(): Promise<void> {
    this.tokenStorage.clearToken();
    this.tokenSignal.set(null);
    this.userNameSignal.set('');
    this.userIdSignal.set('');
    this.sessionNoSignal.set('');
    this.userEmailSignal.set(DEFAULT_USER_EMAIL);
    this.securityCodesSignal.set([]);
    this.tokenExpiresAtSignal.set('');
    await this.router.navigateByUrl('/login');
  }

  private async authenticate(request: LoginRequest): Promise<LoginResponse> {
    return firstValueFrom(this.http.post<LoginResponse>(`${environment.apiBaseUrl}/api/AS/login`, request));
  }

  private applyAuthenticatedSession(response: LoginResponse, fallbackUserId: string): void {
    const userId = response.USER_ID?.trim() || fallbackUserId.trim();
    const userName = response.USER_NAME?.trim() || userId;
    const sessionNo = response.SESSION_NO?.trim() || '';
    const userEmail = response.USER_EMAIL?.trim() || DEFAULT_USER_EMAIL;
    const securityCodes = response.SECURITY_CODEs?.filter((code): code is string => !!code?.trim()).map((code) => code.trim()) ?? [];
    const expiresUtc = response.expiresUtc?.trim() || parseJwtExpiration(response.BearerToken) || '';

    this.tokenStorage.setToken(response.BearerToken);
    this.tokenStorage.setUserName(userName);
    this.tokenStorage.setUserId(userId);
    this.tokenStorage.setSessionNo(sessionNo);
    this.tokenStorage.setUserEmail(userEmail);
    this.tokenStorage.setSecurityCodes(securityCodes);
    this.tokenStorage.setExpiresUtc(expiresUtc);
    this.tokenSignal.set(response.BearerToken);
    this.userNameSignal.set(userName);
    this.userIdSignal.set(userId);
    this.sessionNoSignal.set(sessionNo);
    this.userEmailSignal.set(userEmail);
    this.securityCodesSignal.set(securityCodes);
    this.tokenExpiresAtSignal.set(expiresUtc);
  }
}
