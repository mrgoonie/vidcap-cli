import { Command } from 'commander';
import ora from 'ora';
import { apiGet } from '../../lib/api-client';
import { handleError } from '../../lib/error-handler';
import { output, outputKeyValue, OutputOptions } from '../../lib/output-formatter';
import { YoutubeDownloadQuerySchema } from '../../schemas/youtube-validation-schemas';
import { DownloadData } from '../../types/api-response-types';

export function createDownloadCommand(): Command {
	return new Command('download')
		.description('Download and save YouTube video')
		.argument('<url>', 'YouTube video URL')
		.option('--json', 'Output as JSON')
		.option('--verbose', 'Show detailed output')
		.action(
			async (
				url: string,
				options: {
					json?: boolean;
					verbose?: boolean;
				}
			) => {
				const spinner = ora('Processing video download...').start();

				try {
					const params = YoutubeDownloadQuerySchema.parse({ url });
					const response = await apiGet<DownloadData>('/youtube/download', params);

					spinner.stop();

					if (response.status !== 1 || !response.data) {
						throw new Error(response.message || 'Failed to process download');
					}

					const outputOptions: OutputOptions = {
						json: options.json,
						verbose: options.verbose,
					};

					output(response.data, outputOptions, (data) => {
						console.log();
						outputKeyValue({
							'ID': data.id,
							'Title': data.title,
							'Source ID': data.sourceId,
							'Video URL': data.videoUrl || data.url,
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
