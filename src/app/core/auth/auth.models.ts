export interface LoginRequest {
  USER_ID: string;
  USER_PASSWORD: string;
}

export interface LoginResponse {
  BearerToken: string;
  expiresUtc?: string;
  USER_ID?: string;
  USER_NAME?: string;
  SECURITY_CODEs?: string[];
  SESSION_NO?: string;
  USER_EMAIL?: string;
}
