import { apiGet } from '../lib/api-client';

interface MediaFormat {
	itag: number;
	url: string;
	mimeType: string;
}

interface MediaData {
	videoFiles: MediaFormat[];
	audioFiles: MediaFormat[];
}

describe('YouTube Media Command', () => {
	const testVideoUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

	it('should fetch media formats successfully', async () => {
		const response = await apiGet<MediaData>('/youtube/media', {
			url: testVideoUrl,
		});

		expect(response.status).toBe(1);
		expect(response.data).toBeDefined();
	});

	it('should return video and audio files', async () => {
		const response = await apiGet<MediaData>('/youtube/media', {
			url: testVideoUrl,
		});

		expect(response.status).toBe(1);
		if (response.data) {
			expect(response.data.videoFiles).toBeDefined();
			expect(response.data.audioFiles).toBeDefined();
		}
	});
});
