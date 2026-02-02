import { Command } from 'commander';
import { createVideoGetCommand } from './video-get-command';

export function registerVideoCommands(program: Command): void {
	const videoCommand = new Command('video')
		.description('Video management commands');

	videoCommand.addCommand(createVideoGetCommand());

	program.addCommand(videoCommand);
}
