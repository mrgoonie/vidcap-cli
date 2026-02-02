import { Command } from 'commander';
import ora from 'ora';
import { apiGet } from '../../lib/api-client';
import { handleError } from '../../lib/error-handler';
import { output, outputKeyValue, OutputOptions } from '../../lib/output-formatter';
import { YoutubeScreenshotMultipleQuerySchema } from '../../schemas/youtube-validation-schemas';
import { ScreenshotMultipleData } from '../../types/api-response-types';

export function createScreenshotMultipleCommand(): Command {
	return new Command('screenshots')
		.description('Get multiple screenshots from video at different timestamps')
		.argument('<url>', 'YouTube video URL')
		.option(
			'-s, --seconds <seconds...>',
			'Array of timestamps in seconds (e.g., -s 10 30 60)',
			['0']
		)
		.option('--json', 'Output as JSON')
		.option('--verbose', 'Show detailed output')
		.action(
			async (
				url: string,
				options: {
					seconds: string[];
					json?: boolean;
					verbose?: boolean;
				}
			) => {
				const spinner = ora('Capturing screenshots...').start();

				try {
					const params = YoutubeScreenshotMultipleQuerySchema.parse({
						url,
						second: options.seconds,
					});

					const queryParams = {
						url: params.url,
						second: params.second.join(','),
					};

					const response = await apiGet<ScreenshotMultipleData>(
						'/youtube/screenshot-multiple',
						queryParams
					);

					spinner.stop();

					if (response.status !== 1 || !response.data) {
						throw new Error(response.message || 'Failed to capture screenshots');
					}

					const outputOptions: OutputOptions = {
						json: options.json,
						verbose: options.verbose,
					};

					output(response.data, outputOptions, (data) => {
						console.log();
						outputKeyValue({
							'Video URL': data.url,
							'Timestamps': data.seconds.join(', ') + ' seconds',
						});
						console.log('\nScreenshot URLs:');
						data.image_urls.forEach((imgUrl, index) => {
							console.log(`  [${data.seconds[index]}s] ${imgUrl}`);
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
