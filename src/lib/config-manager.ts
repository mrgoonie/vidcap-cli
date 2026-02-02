import Conf from 'conf';

interface ConfigSchema {
	apiKey?: string;
	baseUrl?: string;
	timeout?: number;
	defaultLocale?: string;
	defaultModel?: string;
}

const config = new Conf<ConfigSchema>({
	projectName: 'vidcap-cli',
	defaults: {
		baseUrl: 'https://vidcap.xyz/api/v1',
		timeout: 120000,
		defaultLocale: 'en',
	},
});

export function getApiKey(): string {
	const envKey = process.env.VIDCAP_API_KEY;
	if (envKey) return envKey;

	const configKey = config.get('apiKey');
	if (configKey) return configKey;

	throw new Error(
		'API key not found. Set VIDCAP_API_KEY environment variable or run: vidcap config set apiKey <your-key>'
	);
}

export function getBaseUrl(): string {
	return process.env.VIDCAP_BASE_URL || config.get('baseUrl') || 'https://vidcap.xyz/api/v1';
}

export function getTimeout(): number {
	const envTimeout = process.env.VIDCAP_TIMEOUT;
	if (envTimeout) return parseInt(envTimeout, 10);
	return config.get('timeout') || 120000;
}

export function getDefaultLocale(): string {
	return process.env.VIDCAP_LOCALE || config.get('defaultLocale') || 'en';
}

export function getDefaultModel(): string | undefined {
	return process.env.VIDCAP_MODEL || config.get('defaultModel');
}

export function setConfig<K extends keyof ConfigSchema>(key: K, value: ConfigSchema[K]): void {
	config.set(key, value);
}

export function getConfig<K extends keyof ConfigSchema>(key: K): ConfigSchema[K] {
	return config.get(key);
}

export function getAllConfig(): ConfigSchema {
	return config.store;
}

export function deleteConfig<K extends keyof ConfigSchema>(key: K): void {
	config.delete(key);
}

export function getConfigPath(): string {
	return config.path;
}
