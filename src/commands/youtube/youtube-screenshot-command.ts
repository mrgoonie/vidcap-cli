import { Command } from 'commander';
import ora from 'ora';
import { apiGet } from '../../lib/api-client';
import { handleError } from '../../lib/error-handler';
import { output, outputKeyValue, OutputOptions } from '../../lib/output-formatter';
import { YoutubeScreenshotQuerySchema } from '../../schemas/youtube-validation-schemas';
import { ScreenshotData } from '../../types/api-response-types';

export function createScreenshotCommand(): Command {
	return new Command('screenshot')
		.description('Get screenshot from video at specific timestamp')
		.argument('<url>', 'YouTube video URL')
		.option('-s, --second <second>', 'Timestamp in seconds or YouTube time format', '0')
		.option('--json', 'Output as JSON')
		.option('--verbose', 'Show detailed output')
		.action(
			async (
				url: string,
				options: {
					second: string;
					json?: boolean;
					verbose?: boolean;
				}
			) => {
				const spinner = ora('Capturing screenshot...').start();

				try {
					const params = YoutubeScreenshotQuerySchema.parse({
						url,
						second: options.second,
					});

					const response = await apiGet<ScreenshotData>('/youtube/screenshot', params);

					spinner.stop();

					if (response.status !== 1 || !response.data) {
						throw new Error(response.message || 'Failed to capture screenshot');
					}

					const outputOptions: OutputOptions = {
						json: options.json,
						verbose: options.verbose,
					};

					output(response.data, outputOptions, (data) => {
						console.log();
						outputKeyValue({
							'Video URL': data.url,
							'Timestamp': `${data.second} seconds`,
							'Screenshot URL': data.image_url,
						});
						console.log();
					});
				} catch (error) {
					spinner.stop();
					handleError(error);
				}
			}
		);
}
