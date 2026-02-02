import { Command } from 'commander';
import ora from 'ora';
import { apiPost } from '../../lib/api-client';
import { handleError } from '../../lib/error-handler';
import { output, OutputOptions } from '../../lib/output-formatter';
import { YoutubeSummaryCustomQuerySchema } from '../../schemas/youtube-validation-schemas';

interface SummaryResponse {
	content: string;
}

export function createSummaryCustomCommand(): Command {
	return new Command('summary-custom')
		.description('Get AI-generated summary with custom prompt')
		.argument('<url>', 'YouTube video URL')
		.requiredOption('-p, --prompt <prompt>', 'Custom prompt for summarization')
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
					prompt: string;
					locale: string;
					model?: string;
					screenshot?: boolean;
					cache: boolean;
					json?: boolean;
					verbose?: boolean;
				}
			) => {
				const spinner = ora('Generating custom summary (this may take a moment)...').start();

				try {
					const params = YoutubeSummaryCustomQuerySchema.parse({
						url,
						prompt: options.prompt,
						locale: options.locale,
						model: options.model,
						screenshot: options.screenshot ? '1' : '0',
						cache: options.cache,
					});

					const response = await apiPost<SummaryResponse>('/youtube/summary-custom', params);

					spinner.stop();

					if (response.status !== 1 || !response.data) {
						throw new Error(response.message || 'Failed to generate custom summary');
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
