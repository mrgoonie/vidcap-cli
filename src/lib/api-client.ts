import axios, { AxiosInstance, AxiosError } from 'axios';
import { getApiKey, getBaseUrl, getTimeout } from './config-manager';

let apiClient: AxiosInstance | null = null;

export function getApiClient(): AxiosInstance {
	if (apiClient) return apiClient;

	const apiKey = getApiKey();
	const baseURL = getBaseUrl();
	const timeout = getTimeout();

	apiClient = axios.create({
		baseURL,
		timeout,
		headers: {
			'X-API-Key': apiKey,
			'Content-Type': 'application/json',
			'User-Agent': 'vidcap-cli/1.0.0',
		},
	});

	apiClient.interceptors.response.use(
		(response) => response,
		(error: AxiosError) => {
			if (error.response) {
				const data = error.response.data as Record<string, unknown>;
				const message = data?.message || data?.error || error.message;
				throw new Error(`API Error (${error.response.status}): ${message}`);
			} else if (error.request) {
				throw new Error(`Network Error: Unable to reach VidCap API. ${error.message}`);
			}
			throw error;
		}
	);

	return apiClient;
}

export function resetApiClient(): void {
	apiClient = null;
}

export interface ApiResponse<T> {
	status: number;
	message?: string;
	data?: T;
}

export async function apiGet<T>(endpoint: string, params?: Record<string, unknown>): Promise<ApiResponse<T>> {
	const client = getApiClient();
	const response = await client.get<ApiResponse<T>>(endpoint, { params });
	return response.data;
}

export async function apiPost<T>(endpoint: string, data?: Record<string, unknown>): Promise<ApiResponse<T>> {
	const client = getApiClient();
	const response = await client.post<ApiResponse<T>>(endpoint, data);
	return response.data;
}
