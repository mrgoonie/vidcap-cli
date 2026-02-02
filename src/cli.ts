import { Command } from 'commander';
import { registerYoutubeCommands } from './commands/youtube';
import { registerVideoCommands } from './commands/video';
import { registerAiCommands } from './commands/ai';
import { registerConfigCommands } from './commands/config';
import { createUpdateCommand } from './commands/update-command';

const packageJson = require('../package.json');

export function createProgram(): Command {
	const program = new Command();

	program
		.name('vidcap')
		.description('CLI tool for VidCap.xyz API - YouTube video transcription and summarization')
		.version(packageJson.version, '-v, --version', 'Output the current version')
		.option('--debug', 'Enable debug mode')
		.hook('preAction', (thisCommand) => {
			const options = thisCommand.opts();
			if (options.debug) {
				process.env.DEBUG = 'true';
			}
		});

	registerYoutubeCommands(program);
	registerVideoCommands(program);
	registerAiCommands(program);
	registerConfigCommands(program);

	program.addCommand(createUpdateCommand());

	program.addHelpText(
		'after',
		`
Examples:
  $ vidcap youtube info "https://youtube.com/watch?v=xxx"
  $ vidcap youtube caption "https://youtube.com/watch?v=xxx" --locale en
  $ vidcap youtube summary "https://youtube.com/watch?v=xxx" --model gpt-4o
  $ vidcap youtube search "typescript tutorial" --max 5
  $ vidcap config set apiKey vcp_xxxxx
  $ vidcap config list

Environment Variables:
  VIDCAP_API_KEY     API key for authentication (takes precedence over config)
  VIDCAP_BASE_URL    Override base API URL (default: https://vidcap.xyz/api/v1)
  VIDCAP_TIMEOUT     Request timeout in milliseconds (default: 120000)

Documentation:
  https://vidcap.xyz/api-docs
`
	);

	return program;
}
