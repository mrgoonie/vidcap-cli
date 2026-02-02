import {
	YoutubeInfoQuerySchema,
	YoutubeCaptionQuerySchema,
	YoutubeSummaryQuerySchema,
	YoutubeScreenshotQuerySchema,
	YoutubeCommentsQuerySchema,
	YoutubeSearchQuerySchema,
} from '../schemas/youtube-validation-schemas';

describe('YouTube Validation Schemas', () => {
	const validYoutubeUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

	describe('YoutubeInfoQuerySchema', () => {
		it('should validate correct input', () => {
			const result = YoutubeInfoQuerySchema.parse({ url: validYoutubeUrl });
			expect(result.url).toBe(validYoutubeUrl);
			expect(result.cache).toBe(true);
		});

		it('should reject invalid YouTube URL', () => {
			expect(() => YoutubeInfoQuerySchema.parse({ url: 'https://vimeo.com/123' })).toThrow();
		});
	});

	describe('YoutubeCaptionQuerySchema', () => {
		it('should validate with defaults', () => {
			const result = YoutubeCaptionQuerySchema.parse({ url: validYoutubeUrl });
			expect(result.locale).toBe('en');
		});

		it('should accept valid extension', () => {
			const result = YoutubeCaptionQuerySchema.parse({
				url: validYoutubeUrl,
				ext: 'vtt',
			});
			expect(result.ext).toBe('vtt');
		});
	});

	describe('YoutubeSummaryQuerySchema', () => {
		it('should validate with defaults', () => {
			const result = YoutubeSummaryQuerySchema.parse({ url: validYoutubeUrl });
			expect(result.locale).toBe('en');
			expect(result.screenshot).toBe('0');
		});

		it('should accept model parameter', () => {
			const result = YoutubeSummaryQuerySchema.parse({
				url: validYoutubeUrl,
				model: 'gpt-4o',
			});
			expect(result.model).toBe('gpt-4o');
		});
	});

	describe('YoutubeScreenshotQuerySchema', () => {
		it('should validate with default second', () => {
			const result = YoutubeScreenshotQuerySchema.parse({ url: validYoutubeUrl });
			expect(result.second).toBe('0');
		});

		it('should accept custom second', () => {
			const result = YoutubeScreenshotQuerySchema.parse({
				url: validYoutubeUrl,
				second: '30',
			});
			expect(result.second).toBe('30');
		});
	});

	describe('YoutubeCommentsQuerySchema', () => {
		it('should validate with URL', () => {
			const result = YoutubeCommentsQuerySchema.parse({ url: validYoutubeUrl });
			expect(result.order).toBe('time');
		});

		it('should validate with videoId', () => {
			const result = YoutubeCommentsQuerySchema.parse({ videoId: 'dQw4w9WgXcQ' });
			expect(result.videoId).toBe('dQw4w9WgXcQ');
		});

		it('should reject if neither url nor videoId', () => {
			expect(() => YoutubeCommentsQuerySchema.parse({})).toThrow();
		});
	});

	describe('YoutubeSearchQuerySchema', () => {
		it('should validate search query', () => {
			const result = YoutubeSearchQuerySchema.parse({ query: 'typescript tutorial' });
			expect(result.query).toBe('typescript tutorial');
			expect(result.maxResults).toBe(10);
			expect(result.order).toBe('relevance');
		});

		it('should reject empty query', () => {
			expect(() => YoutubeSearchQuerySchema.parse({ query: '' })).toThrow();
		});

		it('should validate maxResults range', () => {
			expect(() =>
				YoutubeSearchQuerySchema.parse({ query: 'test', maxResults: 100 })
			).toThrow();
		});
	});
});
