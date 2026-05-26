/**
 * API Helper for Backend Connectivity
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

/**
 * Perform a generic fetch call with error handling and status code tracking.
 */
export async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
  try {
    const url = `${BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      return {
        status: response.status,
        error: `HTTP Error: ${response.statusText} (${response.status})`,
      };
    }

    const data = await response.json();
    return {
      data,
      status: response.status,
    };
  } catch (error) {
    return {
      status: 500,
      error: error instanceof Error ? error.message : "An unknown network error occurred",
    };
  }
}
