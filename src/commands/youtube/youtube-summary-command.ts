import { Command } from 'commander';
import ora from 'ora';
import { apiGet } from '../../lib/api-client';
import { handleError } from '../../lib/error-handler';
import { output, OutputOptions } from '../../lib/output-formatter';
import { YoutubeSummaryQuerySchema } from '../../schemas/youtube-validation-schemas';

interface SummaryResponse {
	content: string;
}

export function createSummaryCommand(): Command {
	return new Command('summary')
		.description('Get AI-generated summary of video content')
		.argument('<url>', 'YouTube video URL')
		.option('-l, --locale <locale>', 'Target language for summary', 'en')
		.option('-m, --model <model>', 'AI model for summarization')
		.option('-s, --screenshot', 'Enable auto-screenshots for summary parts')
		.option('--no-cache', 'Bypass cache and generate fresh summary')
		.option('--json', 'Output as JSON')
		.option('--verbose', 'Show detailed output')
		.action(
			async (
				url: string,
				options: {
					locale: string;
					model?: string;
					screenshot?: boolean;
					cache: boolean;
					json?: boolean;
					verbose?: boolean;
				}
			) => {
				const spinner = ora('Generating summary (this may take a moment)...').start();

				try {
					const params = YoutubeSummaryQuerySchema.parse({
						url,
						locale: options.locale,
						model: options.model,
						screenshot: options.screenshot ? '1' : '0',
						cache: options.cache,
					});

					const response = await apiGet<SummaryResponse>('/youtube/summary', params);

					spinner.stop();

					if (response.status !== 1 || !response.data) {
						throw new Error(response.message || 'Failed to generate summary');
					}

					const outputOptions: OutputOptions = {
						json: options.json,
						verbose: options.verbose,
					};

					output(response.data, outputOptions, (data) => {
						if (typeof data === 'string') {
							console.log(data);
						} else if (data.content) {
							console.log(data.content);
						} else {
							console.log(data);
						}
					});
				} catch (error) {
					spinner.stop();
					handleError(error);
				}
			}
		);
}
