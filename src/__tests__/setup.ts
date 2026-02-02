import * as dotenv from 'dotenv';
import * as path from 'path';

// Load test environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env.test') });

// Ensure API key is set for tests
if (!process.env.VIDCAP_API_KEY) {
	console.warn('Warning: VIDCAP_API_KEY not set. Some tests may fail.');
}

// Increase timeout for API calls
jest.setTimeout(120000);
