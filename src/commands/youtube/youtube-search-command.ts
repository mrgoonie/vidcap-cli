import { Command } from 'commander';
import ora from 'ora';
import chalk from 'chalk';
import { apiGet } from '../../lib/api-client';
import { handleError } from '../../lib/error-handler';
import { output, OutputOptions, truncateText } from '../../lib/output-formatter';
import { YoutubeSearchQuerySchema } from '../../schemas/youtube-validation-schemas';
import { SearchData, SearchResult } from '../../types/api-response-types';

export function createSearchCommand(): Command {
	return new Command('search')
		.description('Search YouTube videos')
		.argument('<query>', 'Search query')
		.option('-n, --max <number>', 'Maximum results (1-50)', '10')
		.option(
			'-o, --order <order>',
			'Sort order (date, rating, relevance, title, viewCount)',
			'relevance'
		)
		.option('-d, --duration <duration>', 'Video duration (short, medium, long, any)', 'any')
		.option('--after <date>', 'Published after date (ISO 8601 format)')
		.option('--before <date>', 'Published before date (ISO 8601 format)')
		.option('-p, --page <token>', 'Pagination token')
		.option('--json', 'Output as JSON')
		.option('--verbose', 'Show detailed output')
		.action(
			async (
				query: string,
				options: {
					max: string;
					order: string;
					duration: string;
					after?: string;
					before?: string;
					page?: string;
					json?: boolean;
					verbose?: boolean;
				}
			) => {
				const spinner = ora('Searching videos...').start();

				try {
					const params = YoutubeSearchQuerySchema.parse({
						query,
						maxResults: parseInt(options.max, 10),
						order: options.order as
							| 'date'
							| 'rating'
							| 'relevance'
							| 'title'
							| 'videoCount'
							| 'viewCount',
						videoDuration: options.duration as 'short' | 'medium' | 'long' | 'any',
						publishedAfter: options.after,
						publishedBefore: options.before,
						pageToken: options.page,
					});

					const response = await apiGet<SearchData>('/youtube/search', {
						q: params.query,
						maxResults: params.maxResults,
						order: params.order,
						videoDuration: params.videoDuration,
						publishedAfter: params.publishedAfter,
						publishedBefore: params.publishedBefore,
						pageToken: params.pageToken,
					});

					spinner.stop();

					if (response.status !== 1 || !response.data) {
						throw new Error(response.message || 'Search failed');
					}

					const outputOptions: OutputOptions = {
						json: options.json,
						verbose: options.verbose,
					};

					output(response.data, outputOptions, (data) => {
						const items = data.items || [];

						if (items.length === 0) {
							console.log('\nNo videos found for your search query.');
							return;
						}

						console.log(
							`\n${chalk.bold('Search Results')} ` +
								chalk.gray(`(${items.length} of ${data.totalResults || 'many'})`) +
								'\n'
						);

						items.forEach((video: SearchResult, index: number) => {
							console.log(chalk.cyan(`${index + 1}. ${video.title}`));
							console.log(chalk.gray(`   ${video.channelTitle}`));
							console.log(`   ${truncateText(video.description || '', 100)}`);
							console.log(chalk.blue(`   https://youtube.com/watch?v=${video.videoId}`));
							console.log();
						});

						if (data.nextPageToken) {
							console.log(chalk.yellow(`Next page token: ${data.nextPageToken}`));
							console.log(chalk.gray('Use --page <token> to fetch next page'));
						}
					});
				} catch (error) {
					spinner.stop();
					handleError(error);
				}
			}
		);
}
