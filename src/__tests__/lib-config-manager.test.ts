import {
	getApiKey,
	getBaseUrl,
	getTimeout,
	getDefaultLocale,
	setConfig,
	getConfig,
	getAllConfig,
	deleteConfig,
} from '../lib/config-manager';

describe('Config Manager', () => {
	describe('getApiKey', () => {
		it('should return API key from environment variable', () => {
			const apiKey = getApiKey();
			expect(apiKey).toBeDefined();
			expect(typeof apiKey).toBe('string');
		});
	});

	describe('getBaseUrl', () => {
		it('should return default base URL', () => {
			const baseUrl = getBaseUrl();
			expect(baseUrl).toBe('https://vidcap.xyz/api/v1');
		});
	});

	describe('getTimeout', () => {
		it('should return default timeout', () => {
			const timeout = getTimeout();
			expect(timeout).toBe(120000);
		});
	});

	describe('getDefaultLocale', () => {
		it('should return default locale', () => {
			const locale = getDefaultLocale();
			expect(locale).toBe('en');
		});
	});

	describe('config operations', () => {
		const testKey = 'defaultModel';
		const testValue = 'gpt-4o-test';

		afterEach(() => {
			deleteConfig(testKey);
		});

		it('should set and get config value', () => {
			setConfig(testKey, testValue);
			const value = getConfig(testKey);
			expect(value).toBe(testValue);
		});

		it('should list all config values', () => {
			setConfig(testKey, testValue);
			const allConfig = getAllConfig();
			expect(allConfig).toBeDefined();
			expect(typeof allConfig).toBe('object');
		});

		it('should delete config value', () => {
			setConfig(testKey, testValue);
			deleteConfig(testKey);
			const value = getConfig(testKey);
			expect(value).toBeUndefined();
		});
	});
});
