import { apiGet } from '../lib/api-client';

interface SearchResult {
	videoId: string;
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
