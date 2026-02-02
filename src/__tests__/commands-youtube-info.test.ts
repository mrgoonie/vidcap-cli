import { apiGet } from '../lib/api-client';

describe('YouTube Info Command', () => {
	const testVideoUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

	it('should fetch video info successfully', async () => {
		const response = await apiGet<{ title: string; description: string; duration: number }>(
			'/youtube/info',
			{ url: testVideoUrl }
		);

		expect(response.status).toBe(1);
		expect(response.data).toBeDefined();
		expect(response.data?.title).toBeDefined();
		expect(typeof response.data?.title).toBe('string');
		expect(response.data?.duration).toBeDefined();
		expect(typeof response.data?.duration).toBe('number');
	});

	it('should return cached data by default', async () => {
		const response1 = await apiGet('/youtube/info', { url: testVideoUrl, cache: true });
		const response2 = await apiGet('/youtube/info', { url: testVideoUrl, cache: true });

		expect(response1.status).toBe(1);
		expect(response2.status).toBe(1);
	});
});
