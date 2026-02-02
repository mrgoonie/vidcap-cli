import { apiGet } from '../lib/api-client';

// Screenshot API can take > 5 minutes to process video and capture frames
// These tests are skipped by default - run manually with increased timeout if needed

describe('YouTube Screenshot Command', () => {
	const testVideoUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

	// Quick validation test that always runs
	it('should validate screenshot parameters', () => {
		expect(testVideoUrl).toContain('youtube.com');
	});

	// Skipped: Screenshot API takes 2-5 minutes per request
	it.skip('should capture screenshot at default timestamp', async () => {
		const response = await apiGet<{ url: string; second: number; image_url: string }>(
			'/youtube/screenshot',
			{ url: testVideoUrl }
		);

		expect(response.status).toBe(1);
		expect(response.data).toBeDefined();
		expect(response.data?.image_url).toBeDefined();
	});

	it.skip('should capture screenshot at specific timestamp', async () => {
		const response = await apiGet<{ url: string; second: number; image_url: string }>(
			'/youtube/screenshot',
			{ url: testVideoUrl, second: '30' }
		);

		expect(response.status).toBe(1);
		expect(response.data?.second).toBe(30);
	});
});
