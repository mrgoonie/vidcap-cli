import { Command } from 'commander';
import ora from 'ora';
import { apiGet } from '../../lib/api-client';
import { handleError } from '../../lib/error-handler';
import { output, outputKeyValue, formatDuration, OutputOptions } from '../../lib/output-formatter';
import { Video } from '../../types/api-response-types';

export function createVideoGetCommand(): Command {
	return new Command('get')
		.description('Get video by internal ID')
		.argument('<id>', 'Video ID')
		.option('--json', 'Output as JSON')
		.option('--verbose', 'Show detailed output')
		.action(
			async (
				id: string,
				options: {
					json?: boolean;
					verbose?: boolean;
				}
			) => {
				const spinner = ora('Fetching video...').start();

				try {
					const response = await apiGet<Video>(`/youtube/video/${id}`);

					spinner.stop();

					if (!response.data) {
						throw new Error(response.message || 'Video not found');
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
							'Provider': data.provider,
							'Duration': formatDuration(data.duration),
							'Channel': data.channelName || 'N/A',
							'Description': data.description?.substring(0, 200) || 'N/A',
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
