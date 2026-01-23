/**
 * Utility for extracting error information from Axios errors
 * Provides consistent error handling across the codebase
 */

export interface AxiosErrorInfo {
  status?: number;
  code?: string;
  message?: string;
}

/**
 * Extract relevant error information from an Axios error
 * Safely handles unknown error types
 */
export function extractAxiosError(error: unknown): AxiosErrorInfo {
  const axiosError = error as {
    response?: { status?: number };
    message?: string;
    code?: string;
  };
  return {
    status: axiosError.response?.status,
    code: axiosError.code,
    message: axiosError.message,
  };
}
