import { Command } from 'commander';
import ora from 'ora';
import chalk from 'chalk';
import { apiGet } from '../../lib/api-client';
import { handleError } from '../../lib/error-handler';
import { output, OutputOptions, truncateText } from '../../lib/output-formatter';
import { YoutubeCommentsQuerySchema } from '../../schemas/youtube-validation-schemas';
import { CommentsData, Comment } from '../../types/api-response-types';

export function createCommentsCommand(): Command {
	return new Command('comments')
		.description('Get YouTube video comments')
		.argument('<url>', 'YouTube video URL')
		.option('-o, --order <order>', 'Sort order (time, relevance)', 'time')
		.option('-r, --replies', 'Include comment replies')
		.option('-p, --page <token>', 'Pagination token for next page')
		.option('--json', 'Output as JSON')
		.option('--verbose', 'Show detailed output')
		.action(
			async (
				url: string,
				options: {
					order: string;
					replies?: boolean;
					page?: string;
					json?: boolean;
					verbose?: boolean;
				}
			) => {
				const spinner = ora('Fetching comments...').start();

				try {
					const params = YoutubeCommentsQuerySchema.parse({
						url,
						order: options.order as 'time' | 'relevance',
						includeReplies: options.replies || false,
						pageToken: options.page,
					});

					const response = await apiGet<CommentsData>('/youtube/comments', params);

					spinner.stop();

					if (response.status !== 1 || !response.data) {
						throw new Error(response.message || 'Failed to fetch comments');
					}

					const outputOptions: OutputOptions = {
						json: options.json,
						verbose: options.verbose,
					};

					output(response.data, outputOptions, (data) => {
						const comments = Array.isArray(data) ? data : data.data;

						if (!comments || comments.length === 0) {
							console.log('\nNo comments found for this video.');
							return;
						}

						console.log(`\n${chalk.bold('Comments')} (${comments.length} shown)\n`);

						comments.forEach((comment: Comment, index: number) => {
							console.log(
								chalk.cyan(`${index + 1}. ${comment.authorDisplayName}`) +
									chalk.gray(` • ${comment.likeCount} likes`)
							);
							console.log(`   ${truncateText(comment.textOriginal, 200)}`);

							if (comment.replies && comment.replies.length > 0) {
								console.log(chalk.gray(`   └ ${comment.replies.length} replies`));
							}
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
