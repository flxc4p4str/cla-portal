import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TokenStorageService {
  private readonly tokenStorageKey = environment.tokenStorageKey;
  private readonly userNameStorageKey = `${environment.tokenStorageKey}_userName`;
  private readonly USER_IDStorageKey = `${environment.tokenStorageKey}_USER_ID`;
  private readonly SESSION_NOStorageKey = `${environment.tokenStorageKey}_SESSION_NO`;

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
  getUserId(): string | null {
    return localStorage.getItem(this.USER_IDStorageKey);
  }

  setUserId(userId: string): void {
    localStorage.setItem(this.USER_IDStorageKey, userId);
  }

  getSessionNo(): string | null {
    return localStorage.getItem(this.SESSION_NOStorageKey);
  }

  setSessionNo(sessionNo: string): void {
    localStorage.setItem(this.SESSION_NOStorageKey, sessionNo);
  }
  clearToken(): void {
    localStorage.removeItem(this.tokenStorageKey);
    localStorage.removeItem(this.userNameStorageKey);
    localStorage.removeItem(this.USER_IDStorageKey);
    localStorage.removeItem(this.SESSION_NOStorageKey);
  }
}
