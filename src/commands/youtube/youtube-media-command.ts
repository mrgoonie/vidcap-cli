import { Command } from 'commander';
import ora from 'ora';
import chalk from 'chalk';
import { apiGet } from '../../lib/api-client';
import { handleError } from '../../lib/error-handler';
import { output, OutputOptions, outputTable } from '../../lib/output-formatter';
import { YoutubeMediaQuerySchema } from '../../schemas/youtube-validation-schemas';
import { MediaData, MediaFormat } from '../../types/api-response-types';

function formatBytes(bytes: string | number | undefined): string {
	if (!bytes) return 'N/A';
	const size = typeof bytes === 'string' ? parseInt(bytes, 10) : bytes;
	if (isNaN(size)) return 'N/A';

	const units = ['B', 'KB', 'MB', 'GB'];
	let unitIndex = 0;
	let value = size;

	while (value >= 1024 && unitIndex < units.length - 1) {
		value /= 1024;
		unitIndex++;
	}

	return `${value.toFixed(1)} ${units[unitIndex]}`;
}

export function createMediaCommand(): Command {
	return new Command('media')
		.description('Get available media formats for a YouTube video')
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
				const spinner = ora('Fetching media formats...').start();

				try {
					const params = YoutubeMediaQuerySchema.parse({ url });
					const response = await apiGet<MediaData>('/youtube/media', params);

					spinner.stop();

					if (response.status !== 1 || !response.data) {
						throw new Error(response.message || 'Failed to fetch media formats');
					}

					const outputOptions: OutputOptions = {
						json: options.json,
						verbose: options.verbose,
					};

					output(response.data, outputOptions, (data) => {
						const videoFiles = data.videoFiles || [];
						const audioFiles = data.audioFiles || [];

						console.log(`\n${chalk.bold('Video Formats')} (${videoFiles.length})\n`);

						if (videoFiles.length > 0) {
							const videoRows = videoFiles.slice(0, 10).map((f: MediaFormat) => [
								f.qualityLabel || f.quality || 'N/A',
								f.mimeType?.split(';')[0] || 'N/A',
								f.fps ? `${f.fps}fps` : 'N/A',
								formatBytes(f.contentLength),
							]);
							outputTable(['Quality', 'Format', 'FPS', 'Size'], videoRows);
						}

						console.log(`\n${chalk.bold('Audio Formats')} (${audioFiles.length})\n`);

						if (audioFiles.length > 0) {
							const audioRows = audioFiles.slice(0, 10).map((f: MediaFormat) => [
								f.audioQuality || 'N/A',
								f.mimeType?.split(';')[0] || 'N/A',
								f.audioSampleRate ? `${f.audioSampleRate}Hz` : 'N/A',
								formatBytes(f.contentLength),
							]);
							outputTable(['Quality', 'Format', 'Sample Rate', 'Size'], audioRows);
						}

						console.log();
					});
				} catch (error) {
					spinner.stop();
					handleError(error);
				}
			}
		);
}
