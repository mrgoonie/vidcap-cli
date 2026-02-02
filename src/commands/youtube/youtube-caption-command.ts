import { Command } from 'commander';
import ora from 'ora';
import { apiGet } from '../../lib/api-client';
import { handleError } from '../../lib/error-handler';
import { output, outputInfo, OutputOptions } from '../../lib/output-formatter';
import { YoutubeCaptionQuerySchema } from '../../schemas/youtube-validation-schemas';
import { CaptionData } from '../../types/api-response-types';

export function createCaptionCommand(): Command {
	return new Command('caption')
		.description('Get video captions/transcript')
		.argument('<url>', 'YouTube video URL')
		.option('-l, --locale <locale>', 'Language code for captions (e.g., en, es, fr)', 'en')
		.option('-m, --model <model>', 'AI model for processing')
		.option('-e, --ext <ext>', 'Caption format (json3, srv1, srv2, srv3, ttml, vtt)')
		.option('--json', 'Output as JSON')
		.option('--verbose', 'Show detailed output')
		.action(
			async (
				url: string,
				options: {
					locale: string;
					model?: string;
					ext?: string;
					json?: boolean;
					verbose?: boolean;
				}
			) => {
				const spinner = ora('Fetching captions...').start();

				try {
					const params = YoutubeCaptionQuerySchema.parse({
						url,
						locale: options.locale,
						model: options.model,
						ext: options.ext as 'json3' | 'srv1' | 'srv2' | 'srv3' | 'ttml' | 'vtt' | undefined,
					});

					const response = await apiGet<CaptionData>('/youtube/caption', params);

					spinner.stop();

					if (response.status !== 1 || !response.data) {
						throw new Error(response.message || 'Failed to fetch captions');
					}

					const outputOptions: OutputOptions = {
						json: options.json,
						verbose: options.verbose,
					};

					output(response.data, outputOptions, (data) => {
						if (data.content) {
							console.log(data.content);
						} else {
							outputInfo('No captions available for this video.');
						}
					});
				} catch (error) {
					spinner.stop();
					handleError(error);
				}
			}
		);
}
