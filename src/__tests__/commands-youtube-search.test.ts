import { apiGet } from '../lib/api-client';
import { attachYoutubeUrls } from '../lib/youtube-url';

interface SearchResult {
	videoId: string;
	url?: string;
	title: string;
	channelTitle: string;
}

interface SearchData {
	items: SearchResult[];
	nextPageToken?: string;
	totalResults?: number;
}

describe('YouTube Search Command', () => {
	it('should search videos successfully', async () => {
		const response = await apiGet<SearchData>('/youtube/search', {
			q: 'typescript tutorial',
			maxResults: 5,
		});

		expect(response.status).toBe(1);
		expect(response.data).toBeDefined();
		expect(response.data?.items).toBeDefined();
		expect(Array.isArray(response.data?.items)).toBe(true);
	});

	it('should attach a YouTube URL to every search result item', () => {
		const items: SearchResult[] = [
			{ videoId: 'dQw4w9WgXcQ', title: 'A', channelTitle: 'B' },
			{ videoId: 'abc123XYZ_-', title: 'C', channelTitle: 'D' },
		];

		const withUrls = attachYoutubeUrls(items);

		expect(withUrls).toHaveLength(2);
		withUrls.forEach((item, i) => {
			expect(item.url).toBe(`https://www.youtube.com/watch?v=${items[i].videoId}`);
			expect(item.url).toMatch(/^https:\/\/(www\.)?youtube\.com\/watch\?v=/);
		});
	});

	it('should preserve an existing url field when present', () => {
		const items: SearchResult[] = [
			{
				videoId: 'dQw4w9WgXcQ',
				url: 'https://youtu.be/dQw4w9WgXcQ',
				title: 'A',
				channelTitle: 'B',
			},
		];

		const withUrls = attachYoutubeUrls(items);

		expect(withUrls[0].url).toBe('https://youtu.be/dQw4w9WgXcQ');
	});

	it('should respect maxResults parameter', async () => {
		const response = await apiGet<SearchData>('/youtube/search', {
			q: 'javascript',
			maxResults: 3,
		});

		expect(response.status).toBe(1);
		expect(response.data?.items.length).toBeLessThanOrEqual(3);
	});

	it('should support order parameter', async () => {
		const response = await apiGet<SearchData>('/youtube/search', {
			q: 'programming',
			maxResults: 5,
			order: 'date',
		});

		expect(response.status).toBe(1);
		expect(response.data?.items).toBeDefined();
	});
});
