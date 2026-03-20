import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);
  const token = authService.token();
const USER_ID = authService.userId();
const SESSION_NO = authService.sessionNo();
  return token
    ? next(request.clone({ setHeaders: { Authorization: `Bearer ${token}`, Application: 'pm', 'USER_ID': USER_ID, 'SESSION_NO': SESSION_NO } }))
    : next(request);
};
