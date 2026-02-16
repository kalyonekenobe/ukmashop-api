export interface ApiResponse<T> {
  success: boolean;
  data?: T | null;
  message?: string;
  errors?: Record<string, string>;
}

export interface RetryOptions {
  retries?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
  factor?: number;
  jitter?: boolean;
  shouldRetry?: (error: any) => boolean;
}
