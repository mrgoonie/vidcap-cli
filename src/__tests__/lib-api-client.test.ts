import { getApiClient, resetApiClient, apiGet } from '../lib/api-client';

describe('API Client', () => {
	beforeEach(() => {
		resetApiClient();
	});

	describe('getApiClient', () => {
		it('should create an axios instance with correct config', () => {
			const client = getApiClient();
			expect(client).toBeDefined();
			expect(client.defaults.baseURL).toBe('https://vidcap.xyz/api/v1');
			expect(client.defaults.headers['X-API-Key']).toBeDefined();
		});

		it('should return the same instance on multiple calls', () => {
			const client1 = getApiClient();
			const client2 = getApiClient();
			expect(client1).toBe(client2);
		});

		it('should return new instance after reset', () => {
			const client1 = getApiClient();
			resetApiClient();
			const client2 = getApiClient();
			expect(client1).not.toBe(client2);
		});
	});

	describe('apiGet', () => {
		it('should make GET requests successfully', async () => {
			const response = await apiGet('/youtube/info', {
				url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
			});
			expect(response).toBeDefined();
			expect(response.status).toBe(1);
		});
	});
});
