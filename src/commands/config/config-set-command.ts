import { Command } from 'commander';
import { setConfig } from '../../lib/config-manager';
import { outputSuccess, outputError } from '../../lib/output-formatter';

const VALID_KEYS = ['apiKey', 'baseUrl', 'timeout', 'defaultLocale', 'defaultModel'] as const;
type ConfigKey = (typeof VALID_KEYS)[number];

export function createConfigSetCommand(): Command {
	return new Command('set')
		.description('Set a configuration value')
		.argument('<key>', `Config key (${VALID_KEYS.join(', ')})`)
		.argument('<value>', 'Config value')
		.action((key: string, value: string) => {
			if (!VALID_KEYS.includes(key as ConfigKey)) {
				outputError(`Invalid config key: ${key}`);
				console.log(`Valid keys: ${VALID_KEYS.join(', ')}`);
				process.exit(1);
			}

			let parsedValue: string | number | boolean = value;

			if (key === 'timeout') {
				parsedValue = parseInt(value, 10);
				if (isNaN(parsedValue)) {
					outputError('Timeout must be a number (milliseconds)');
					process.exit(1);
				}
			}

			setConfig(key as ConfigKey, parsedValue as never);
			outputSuccess(`Set ${key} successfully`);
		});
}
