import { formatDuration, truncateText } from '../lib/output-formatter';

describe('Output Formatter', () => {
	describe('formatDuration', () => {
		it('should format seconds to mm:ss', () => {
			expect(formatDuration(65)).toBe('1:05');
			expect(formatDuration(0)).toBe('0:00');
			expect(formatDuration(59)).toBe('0:59');
		});

		it('should format to hh:mm:ss for longer durations', () => {
			expect(formatDuration(3661)).toBe('1:01:01');
			expect(formatDuration(3600)).toBe('1:00:00');
		});
	});

	describe('truncateText', () => {
		it('should return text unchanged if shorter than max', () => {
			expect(truncateText('hello', 10)).toBe('hello');
		});

		it('should truncate and add ellipsis if longer than max', () => {
			expect(truncateText('hello world', 8)).toBe('hello...');
		});

		it('should handle exact length', () => {
			expect(truncateText('hello', 5)).toBe('hello');
		});
	});
});
