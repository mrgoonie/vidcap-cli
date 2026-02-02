import { Command } from 'commander';
import { createAiModelsCommand } from './ai-models-command';

export function registerAiCommands(program: Command): void {
	const aiCommand = new Command('ai')
		.description('AI-related commands');

	aiCommand.addCommand(createAiModelsCommand());

	program.addCommand(aiCommand);
}
