import chalk from 'chalk';
import { ZodError } from 'zod';
import { AxiosError } from 'axios';

export const EXIT_CODES = {
	SUCCESS: 0,
	USER_ERROR: 1,
	API_ERROR: 2,
} as const;

export function handleError(error: unknown): never {
	if (error instanceof ZodError) {
		console.error(chalk.red('Validation Error:'));
		error.errors.forEach((err) => {
			console.error(chalk.red(`  - ${err.path.join('.')}: ${err.message}`));
		});
		process.exit(EXIT_CODES.USER_ERROR);
	}

	if (error instanceof AxiosError) {
		const status = error.response?.status;
		const data = error.response?.data as Record<string, unknown> | undefined;
		const message = data?.message || data?.error || error.message;

		if (status === 401) {
			console.error(chalk.red('Authentication Error: Invalid or missing API key.'));
			console.error(chalk.yellow('Set your API key with: vidcap config set apiKey <your-key>'));
			console.error(chalk.yellow('Or set VIDCAP_API_KEY environment variable'));
		} else if (status === 403) {
			console.error(chalk.red('Access Denied: You do not have permission for this action.'));
			console.error(chalk.yellow('Check your API plan limits at https://vidcap.xyz'));
		} else if (status === 404) {
			console.error(chalk.red('Not Found: The requested resource does not exist.'));
		} else if (status === 429) {
			console.error(chalk.red('Rate Limit Exceeded: Too many requests.'));
			console.error(chalk.yellow('Please wait a moment and try again.'));
		} else if (status && status >= 500) {
			console.error(chalk.red(`Server Error (${status}): ${message}`));
			console.error(chalk.yellow('The VidCap API is experiencing issues. Please try again later.'));
		} else {
			console.error(chalk.red(`API Error: ${message}`));
		}
		process.exit(EXIT_CODES.API_ERROR);
	}

	if (error instanceof Error) {
		if (error.message.includes('API key not found')) {
			console.error(chalk.red('Configuration Error: API key not found.'));
			console.error(chalk.yellow('Set your API key with: vidcap config set apiKey <your-key>'));
			console.error(chalk.yellow('Or set VIDCAP_API_KEY environment variable'));
			process.exit(EXIT_CODES.USER_ERROR);
		}

		console.error(chalk.red(`Error: ${error.message}`));
		process.exit(EXIT_CODES.USER_ERROR);
	}

	console.error(chalk.red('An unexpected error occurred.'));
	console.error(error);
	process.exit(EXIT_CODES.USER_ERROR);
}

export function validateUrl(url: string): string {
	let parsed: URL;
	try {
		parsed = new URL(url);
	} catch {
		throw new Error(`Invalid URL: ${url}`);
	}

	if (!['http:', 'https:'].includes(parsed.protocol)) {
		throw new Error('URL must use http or https protocol');
	}
	return url;
}

export function validateYoutubeUrl(url: string): string {
	validateUrl(url);
	const youtubePatterns = [
		/^https?:\/\/(www\.)?youtube\.com\/watch\?v=/,
		/^https?:\/\/youtu\.be\//,
		/^https?:\/\/(www\.)?youtube\.com\/shorts\//,
		/^https?:\/\/(www\.)?youtube\.com\/embed\//,
	];

	if (!youtubePatterns.some((pattern) => pattern.test(url))) {
		throw new Error('Invalid YouTube URL. Please provide a valid YouTube video URL.');
	}

	return url;
}
