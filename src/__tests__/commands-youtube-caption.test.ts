import { apiGet } from '../lib/api-client';

describe('YouTube Caption Command', () => {
	const testVideoUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

	it('should fetch captions successfully', async () => {
		const response = await apiGet<{ content: string }>('/youtube/caption', {
			url: testVideoUrl,
			locale: 'en',
		});

		expect(response.status).toBe(1);
		expect(response.data).toBeDefined();
	});

	it('should accept different locales', async () => {
		const response = await apiGet('/youtube/caption', {
			url: testVideoUrl,
			locale: 'en',
		});

		expect(response.status).toBe(1);
	});
});
