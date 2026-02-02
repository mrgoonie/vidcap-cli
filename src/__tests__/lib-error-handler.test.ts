import { validateUrl, validateYoutubeUrl } from '../lib/error-handler';

describe('Error Handler', () => {
	describe('validateUrl', () => {
		it('should accept valid http URLs', () => {
			expect(validateUrl('http://example.com')).toBe('http://example.com');
		});

		it('should accept valid https URLs', () => {
			expect(validateUrl('https://example.com')).toBe('https://example.com');
		});

		it('should throw for invalid URLs', () => {
			expect(() => validateUrl('not-a-url')).toThrow('Invalid URL');
		});

		it('should throw for non-http protocols', () => {
			expect(() => validateUrl('ftp://example.com')).toThrow('http or https');
		});
	});

	describe('validateYoutubeUrl', () => {
		it('should accept youtube.com/watch URLs', () => {
			const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
			expect(validateYoutubeUrl(url)).toBe(url);
		});

		it('should accept youtu.be short URLs', () => {
			const url = 'https://youtu.be/dQw4w9WgXcQ';
			expect(validateYoutubeUrl(url)).toBe(url);
		});

		it('should accept youtube shorts URLs', () => {
			const url = 'https://www.youtube.com/shorts/abc123';
			expect(validateYoutubeUrl(url)).toBe(url);
		});

		it('should accept youtube embed URLs', () => {
			const url = 'https://www.youtube.com/embed/dQw4w9WgXcQ';
			expect(validateYoutubeUrl(url)).toBe(url);
		});

		it('should throw for non-YouTube URLs', () => {
			expect(() => validateYoutubeUrl('https://vimeo.com/123')).toThrow('Invalid YouTube URL');
		});
	});
});
