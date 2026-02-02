import { Command } from 'commander';
import chalk from 'chalk';
import { getAllConfig, getConfigPath } from '../../lib/config-manager';
import { outputJson, outputTable } from '../../lib/output-formatter';

export function createConfigListCommand(): Command {
	return new Command('list')
		.alias('ls')
		.description('List all configuration values')
		.option('--json', 'Output as JSON')
		.option('--show-secrets', 'Show full API key (default: masked)')
		.action((options: { json?: boolean; showSecrets?: boolean }) => {
			const config = getAllConfig();

			if (options.json) {
				const output = { ...config };
				if (!options.showSecrets && output.apiKey) {
					output.apiKey =
						output.apiKey.substring(0, 8) + '...' + output.apiKey.substring(output.apiKey.length - 4);
				}
				outputJson(output);
				return;
			}

			console.log(`\n${chalk.bold('Configuration')}\n`);
			console.log(chalk.gray(`Config file: ${getConfigPath()}\n`));

			const rows: string[][] = [];

			for (const [key, value] of Object.entries(config)) {
				let displayValue: string;

				if (value === undefined || value === null) {
					displayValue = chalk.gray('(not set)');
				} else if (key === 'apiKey' && !options.showSecrets && typeof value === 'string') {
					displayValue = value.substring(0, 8) + '...' + value.substring(value.length - 4);
				} else {
					displayValue = String(value);
				}

				rows.push([key, displayValue]);
			}

			if (rows.length === 0) {
				console.log(chalk.gray('No configuration values set.'));
				console.log(chalk.gray('Use `vidcap config set <key> <value>` to set values.\n'));
				return;
			}

			outputTable(['Key', 'Value'], rows);

			console.log(
				chalk.gray('\nEnvironment variables (VIDCAP_API_KEY, etc.) take precedence over config.\n')
			);
		});
}
