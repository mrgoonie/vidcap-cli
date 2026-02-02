import chalk from 'chalk';
import Table from 'cli-table3';

export interface OutputOptions {
	json?: boolean;
	verbose?: boolean;
}

export function outputJson(data: unknown): void {
	console.log(JSON.stringify(data, null, 2));
}

export function outputSuccess(message: string): void {
	console.log(chalk.green('✓'), message);
}

export function outputError(message: string): void {
	console.error(chalk.red('✗'), message);
}

export function outputWarning(message: string): void {
	console.log(chalk.yellow('⚠'), message);
}

export function outputInfo(message: string): void {
	console.log(chalk.blue('ℹ'), message);
}

export function outputTable(headers: string[], rows: string[][]): void {
	const table = new Table({
		head: headers.map((h) => chalk.cyan(h)),
		style: { head: [], border: [] },
	});
	rows.forEach((row) => table.push(row));
	console.log(table.toString());
}

export function outputKeyValue(data: Record<string, unknown>, indent = 0): void {
	const prefix = '  '.repeat(indent);
	for (const [key, value] of Object.entries(data)) {
		if (value === null || value === undefined) continue;
		if (typeof value === 'object' && !Array.isArray(value)) {
			console.log(`${prefix}${chalk.cyan(key)}:`);
			outputKeyValue(value as Record<string, unknown>, indent + 1);
		} else if (Array.isArray(value)) {
			console.log(`${prefix}${chalk.cyan(key)}: ${value.join(', ')}`);
		} else {
			console.log(`${prefix}${chalk.cyan(key)}: ${value}`);
		}
	}
}

export function formatDuration(seconds: number): string {
	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	const secs = Math.floor(seconds % 60);

	if (hours > 0) {
		return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
	}
	return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

export function truncateText(text: string, maxLength: number): string {
	if (text.length <= maxLength) return text;
	return text.substring(0, maxLength - 3) + '...';
}

export function output<T>(data: T, options: OutputOptions, formatter?: (data: T) => void): void {
	if (options.json) {
		outputJson(data);
	} else if (formatter) {
		formatter(data);
	} else {
		outputJson(data);
	}
}
