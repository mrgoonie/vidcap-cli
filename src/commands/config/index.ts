import { Command } from 'commander';
import { createConfigSetCommand } from './config-set-command';
import { createConfigGetCommand } from './config-get-command';
import { createConfigListCommand } from './config-list-command';

export function registerConfigCommands(program: Command): void {
	const configCommand = new Command('config')
		.description('Manage CLI configuration');

	configCommand.addCommand(createConfigSetCommand());
	configCommand.addCommand(createConfigGetCommand());
	configCommand.addCommand(createConfigListCommand());

	program.addCommand(configCommand);
}
