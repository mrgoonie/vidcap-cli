import { z } from 'zod';

const youtubeUrlPattern =
	/^https?:\/\/(www\.)?(youtube\.com\/(watch\?v=|shorts\/|embed\/)|youtu\.be\/)/;

export const YoutubeUrlSchema = z.string().regex(youtubeUrlPattern, {
	message: 'Invalid YouTube URL. Must be a valid YouTube video URL.',
});

export const YoutubeInfoQuerySchema = z.object({
	url: YoutubeUrlSchema,
	cache: z.boolean().optional().default(true),
});

export const YoutubeCaptionQuerySchema = z.object({
	url: YoutubeUrlSchema,
	locale: z.string().optional().default('en'),
	model: z.string().optional(),
	ext: z.enum(['json3', 'srv1', 'srv2', 'srv3', 'ttml', 'vtt']).optional(),
});

export const YoutubeSummaryQuerySchema = z.object({
	url: YoutubeUrlSchema,
	locale: z.string().optional().default('en'),
	model: z.string().optional(),
	screenshot: z.string().optional().default('0'),
	cache: z.boolean().optional(),
});

export const YoutubeSummaryCustomQuerySchema = z.object({
	url: YoutubeUrlSchema,
	locale: z.string().optional().default('en'),
	model: z.string().optional(),
	screenshot: z.string().optional().default('0'),
	cache: z.boolean().optional(),
	prompt: z.string().min(1, 'Custom prompt is required'),
});

export const YoutubeScreenshotQuerySchema = z.object({
	url: YoutubeUrlSchema,
	second: z.string().optional().default('0'),
});

export const YoutubeScreenshotMultipleQuerySchema = z.object({
	url: YoutubeUrlSchema,
	second: z.array(z.string()).optional().default(['0']),
});

export const YoutubeCommentsQuerySchema = z.object({
	url: YoutubeUrlSchema.optional(),
	videoId: z.string().optional(),
	order: z.enum(['time', 'relevance']).optional().default('time'),
	format: z.enum(['plainText', 'html']).optional().default('plainText'),
	pageToken: z.string().optional(),
	includeReplies: z.boolean().optional().default(false),
	hl: z.string().optional().default('en'),
}).refine((data) => data.url || data.videoId, {
	message: 'Either url or videoId must be provided',
});

export const YoutubeSearchQuerySchema = z.object({
	query: z.string().min(1, 'Search query is required'),
	maxResults: z.number().min(1).max(50).optional().default(10),
	order: z
		.enum(['date', 'rating', 'relevance', 'title', 'videoCount', 'viewCount'])
		.optional()
		.default('relevance'),
	publishedAfter: z.string().optional(),
	publishedBefore: z.string().optional(),
	videoDuration: z.enum(['short', 'medium', 'long', 'any']).optional().default('any'),
	videoDefinition: z.enum(['high', 'standard', 'any']).optional().default('any'),
	pageToken: z.string().optional(),
});

export const YoutubeMediaQuerySchema = z.object({
	url: YoutubeUrlSchema,
});

export const YoutubeDownloadQuerySchema = z.object({
	url: YoutubeUrlSchema,
});

export type YoutubeInfoQuery = z.infer<typeof YoutubeInfoQuerySchema>;
export type YoutubeCaptionQuery = z.infer<typeof YoutubeCaptionQuerySchema>;
export type YoutubeSummaryQuery = z.infer<typeof YoutubeSummaryQuerySchema>;
export type YoutubeSummaryCustomQuery = z.infer<typeof YoutubeSummaryCustomQuerySchema>;
export type YoutubeScreenshotQuery = z.infer<typeof YoutubeScreenshotQuerySchema>;
export type YoutubeScreenshotMultipleQuery = z.infer<typeof YoutubeScreenshotMultipleQuerySchema>;
export type YoutubeCommentsQuery = z.infer<typeof YoutubeCommentsQuerySchema>;
export type YoutubeSearchQuery = z.infer<typeof YoutubeSearchQuerySchema>;
export type YoutubeMediaQuery = z.infer<typeof YoutubeMediaQuerySchema>;
export type YoutubeDownloadQuery = z.infer<typeof YoutubeDownloadQuerySchema>;
