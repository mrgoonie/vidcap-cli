import { Command } from 'commander';
import { getConfig } from '../../lib/config-manager';
import { outputInfo, outputJson } from '../../lib/output-formatter';

const VALID_KEYS = ['apiKey', 'baseUrl', 'timeout', 'defaultLocale', 'defaultModel'] as const;
type ConfigKey = (typeof VALID_KEYS)[number];

export function createConfigGetCommand(): Command {
	return new Command('get')
		.description('Get a configuration value')
		.argument('<key>', `Config key (${VALID_KEYS.join(', ')})`)
		.option('--json', 'Output as JSON')
		.action((key: string, options: { json?: boolean }) => {
			if (!VALID_KEYS.includes(key as ConfigKey)) {
				console.error(`Invalid config key: ${key}`);
				console.log(`Valid keys: ${VALID_KEYS.join(', ')}`);
				process.exit(1);
			}

			const value = getConfig(key as ConfigKey);

			if (options.json) {
				outputJson({ [key]: value });
			} else {
				if (value === undefined) {
					outputInfo(`${key}: (not set)`);
				} else if (key === 'apiKey' && typeof value === 'string') {
					const masked = value.substring(0, 8) + '...' + value.substring(value.length - 4);
					outputInfo(`${key}: ${masked}`);
				} else {
					outputInfo(`${key}: ${value}`);
				}
			}
		});
}
