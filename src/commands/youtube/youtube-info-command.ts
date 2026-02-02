import { Command } from 'commander';
import ora from 'ora';
import { apiGet } from '../../lib/api-client';
import { handleError } from '../../lib/error-handler';
import { output, outputKeyValue, formatDuration, OutputOptions } from '../../lib/output-formatter';
import { YoutubeInfoQuerySchema } from '../../schemas/youtube-validation-schemas';
import { VideoInfo } from '../../types/api-response-types';

interface InfoResponse {
	title: string;
	description: string;
	duration: number;
	[key: string]: unknown;
}

export function createInfoCommand(): Command {
	return new Command('info')
		.description('Get YouTube video information')
		.argument('<url>', 'YouTube video URL')
		.option('--no-cache', 'Bypass cache and fetch fresh data')
		.option('--json', 'Output as JSON')
		.option('--verbose', 'Show detailed output')
		.action(async (url: string, options: { cache: boolean; json?: boolean; verbose?: boolean }) => {
			const spinner = ora('Fetching video info...').start();

			try {
				const params = YoutubeInfoQuerySchema.parse({
					url,
					cache: options.cache,
				});

				const response = await apiGet<InfoResponse>('/youtube/info', params);

				spinner.stop();

				if (response.status !== 1 || !response.data) {
					throw new Error(response.message || 'Failed to fetch video info');
				}

				const outputOptions: OutputOptions = {
					json: options.json,
					verbose: options.verbose,
				};

				output(response.data, outputOptions, (data) => {
					console.log();
					outputKeyValue({
						Title: data.title,
						Duration: formatDuration(data.duration),
						Description: data.description?.substring(0, 200) + (data.description?.length > 200 ? '...' : ''),
					});
					console.log();
				});
			} catch (error) {
				spinner.stop();
				handleError(error);
			}
		});
}
