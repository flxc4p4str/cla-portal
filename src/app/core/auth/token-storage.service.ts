import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TokenStorageService {
  private readonly tokenStorageKey = environment.tokenStorageKey;
  private readonly userNameStorageKey = `${environment.tokenStorageKey}_userName`;

  getToken(): string | null {
    return localStorage.getItem(this.tokenStorageKey);
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenStorageKey, token);
  }

  getUserName(): string | null {
    return localStorage.getItem(this.userNameStorageKey);
  }

  setUserName(userName: string): void {
    localStorage.setItem(this.userNameStorageKey, userName);
  }

  clearToken(): void {
    localStorage.removeItem(this.tokenStorageKey);
    localStorage.removeItem(this.userNameStorageKey);
  }
}
