import { HttpContextToken, HttpErrorResponse, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError } from 'rxjs';
import { throwError } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { TokenRefreshFlowService } from './token-refresh-flow.service';

const RELEASED_AFTER_TOKEN_REFRESH = new HttpContextToken<boolean>(() => false);

function isApiRequest(url: string): boolean {
  return url.startsWith(environment.apiBaseUrl) || url.startsWith(environment.urlBaseABS);
}

function isLoginRequest(url: string): boolean {
  return url.includes('/api/AS/login');
}

function attachAuthHeaders(request: HttpRequest<unknown>, authService: AuthService): HttpRequest<unknown> {
  const token = authService.token();
  if (!token) {
    return request;
  }

  return request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
      Application: 'pm',
      USER_ID: authService.userId(),
      SESSION_NO: authService.sessionNo(),
    },
  });
}

function markForRefreshRetry(request: HttpRequest<unknown>): HttpRequest<unknown> {
  return request.clone({
    context: request.context.set(RELEASED_AFTER_TOKEN_REFRESH, true),
  });
}

function isExpiredTokenError(error: unknown): error is HttpErrorResponse {
  console.log('error', error);
  return (error instanceof HttpErrorResponse) && error.status === 401;

  // if (!(error instanceof HttpErrorResponse) || error.status !== 401) {
  //   return false;
  // }

  // const authenticateHeader = error.headers.get('Www-Authenticate') ?? '';
  // const normalizedHeader = authenticateHeader.toLowerCase();

  // return normalizedHeader.includes('invalid_token')
  //   && (normalizedHeader.includes('token expired') || normalizedHeader.includes('expired at'));
}

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);
  const refreshFlow = inject(TokenRefreshFlowService);

  const bypassRefreshHandling = !isApiRequest(request.url) || isLoginRequest(request.url);
  const sendRequest = (req: HttpRequest<unknown>) => next(attachAuthHeaders(req, authService));

  if (bypassRefreshHandling) {
    return sendRequest(request);
  }

  if (refreshFlow.isRefreshPending()) {
    return refreshFlow.queueRetry(() => sendRequest(markForRefreshRetry(request)));
  }

  return sendRequest(request).pipe(
    catchError((error) => {
      if (!isExpiredTokenError(error)) {
        return throwError(() => error);
      }

      if (request.context.get(RELEASED_AFTER_TOKEN_REFRESH)) {
        void authService.logout();
        return throwError(() => error);
      }

      if (!refreshFlow.startRefreshFlow()) {
        void authService.logout();
        return throwError(() => error);
      }

      return refreshFlow.queueRetry(() => sendRequest(markForRefreshRetry(request)));
    })
  );
};
