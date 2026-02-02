import { Command } from 'commander';
import { createInfoCommand } from './youtube-info-command';
import { createCaptionCommand } from './youtube-caption-command';
import { createSummaryCommand } from './youtube-summary-command';
import { createSummaryCustomCommand } from './youtube-summary-custom-command';
import { createScreenshotCommand } from './youtube-screenshot-command';
import { createScreenshotMultipleCommand } from './youtube-screenshot-multiple-command';
import { createCommentsCommand } from './youtube-comments-command';
import { createSearchCommand } from './youtube-search-command';
import { createMediaCommand } from './youtube-media-command';
import { createDownloadCommand } from './youtube-download-command';

export function registerYoutubeCommands(program: Command): void {
	const youtubeCommand = new Command('youtube')
		.alias('yt')
		.description('YouTube video commands');

	youtubeCommand.addCommand(createInfoCommand());
	youtubeCommand.addCommand(createCaptionCommand());
	youtubeCommand.addCommand(createSummaryCommand());
	youtubeCommand.addCommand(createSummaryCustomCommand());
	youtubeCommand.addCommand(createScreenshotCommand());
	youtubeCommand.addCommand(createScreenshotMultipleCommand());
	youtubeCommand.addCommand(createCommentsCommand());
	youtubeCommand.addCommand(createSearchCommand());
	youtubeCommand.addCommand(createMediaCommand());
	youtubeCommand.addCommand(createDownloadCommand());

	program.addCommand(youtubeCommand);
}
