import { Command } from 'commander';
import chalk from 'chalk';
import { output, outputTable, OutputOptions } from '../../lib/output-formatter';

interface AiModel {
	id: string;
	name: string;
	provider: string;
	description?: string;
}

const AVAILABLE_MODELS: AiModel[] = [
	{
		id: 'gpt-4o',
		name: 'GPT-4o',
		provider: 'OpenAI',
		description: 'Most capable model, best for complex analysis',
	},
	{
		id: 'gpt-4o-mini',
		name: 'GPT-4o Mini',
		provider: 'OpenAI',
		description: 'Fast and efficient for simpler tasks',
	},
	{
		id: 'claude-3-5-sonnet',
		name: 'Claude 3.5 Sonnet',
		provider: 'Anthropic',
		description: 'Excellent for detailed summaries',
	},
	{
		id: 'claude-3-haiku',
		name: 'Claude 3 Haiku',
		provider: 'Anthropic',
		description: 'Fast responses, good for quick summaries',
	},
	{
		id: 'gemini-pro',
		name: 'Gemini Pro',
		provider: 'Google',
		description: 'Good balance of speed and quality',
	},
	{
		id: 'gemini-flash',
		name: 'Gemini Flash',
		provider: 'Google',
		description: 'Fastest response times',
	},
];

export function createAiModelsCommand(): Command {
	return new Command('models')
		.description('List available AI models for summarization')
		.option('--json', 'Output as JSON')
		.action((options: { json?: boolean }) => {
			const outputOptions: OutputOptions = {
				json: options.json,
			};

			output(AVAILABLE_MODELS, outputOptions, (models) => {
				console.log(`\n${chalk.bold('Available AI Models')}\n`);

				const rows = models.map((m: AiModel) => [
					m.id,
					m.name,
					m.provider,
					m.description || '',
				]);

				outputTable(['ID', 'Name', 'Provider', 'Description'], rows);

				console.log(
					chalk.gray('\nUse --model <id> with summary commands to specify a model.\n')
				);
			});
		});
}
