import { Command } from 'commander';
import { execSync } from 'child_process';
import ora from 'ora';
import chalk from 'chalk';
import { outputSuccess, outputError, outputInfo } from '../lib/output-formatter';

export function createUpdateCommand(): Command {
	return new Command('update')
		.description('Update vidcap-cli to the latest version')
		.option('--check', 'Only check for updates without installing')
		.action((options: { check?: boolean }) => {
			const spinner = ora('Checking for updates...').start();

			try {
				const currentVersion = require('../../package.json').version;

				let latestVersion: string;
				try {
					latestVersion = execSync('npm view vidcap-cli version', {
						encoding: 'utf-8',
						stdio: ['pipe', 'pipe', 'pipe'],
					}).trim();
				} catch {
					spinner.stop();
					outputError('Failed to check for updates. Package may not be published yet.');
					outputInfo(`Current version: ${currentVersion}`);
					return;
				}

				spinner.stop();

				if (currentVersion === latestVersion) {
					outputSuccess(`You are on the latest version (${currentVersion})`);
					return;
				}

				console.log();
				outputInfo(`Current version: ${currentVersion}`);
				outputInfo(`Latest version:  ${latestVersion}`);
				console.log();

				if (options.check) {
					console.log(chalk.yellow('Run `vidcap update` to update to the latest version.'));
					return;
				}

				const updateSpinner = ora('Updating vidcap-cli...').start();

				try {
					execSync('npm install -g vidcap-cli@latest', {
						stdio: ['pipe', 'pipe', 'pipe'],
					});
					updateSpinner.stop();
					outputSuccess(`Updated to version ${latestVersion}`);
				} catch (error) {
					updateSpinner.stop();
					outputError('Failed to update. Try running with sudo or fix npm permissions.');
					console.log(chalk.gray('  sudo npm install -g vidcap-cli@latest'));
				}
			} catch (error) {
				spinner.stop();
				outputError('Failed to check for updates.');
				if (error instanceof Error) {
					console.log(chalk.gray(error.message));
				}
			}
		});
}
