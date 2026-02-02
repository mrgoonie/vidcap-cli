export interface VideoInfo {
	title: string;
	description: string;
	duration: number;
	channelId?: string;
	channelName?: string;
	thumbnailUrl?: string;
	viewCount?: number;
	likeCount?: number;
	publishedAt?: string;
}

export interface MediaFormat {
	itag: number;
	url: string;
	mimeType: string;
	quality: string;
	qualityLabel?: string;
	bitrate?: number;
	width?: number;
	height?: number;
	fps?: number;
	audioQuality?: string;
	audioSampleRate?: string;
	contentLength?: string;
}

export interface MediaData {
	videoFiles: MediaFormat[];
	audioFiles: MediaFormat[];
}

export interface CaptionSegment {
	text: string;
	start: number;
	duration: number;
}

export interface CaptionData {
	id: string;
	videoProvider: string;
	sourceId: string;
	videoId: string;
	ext: string;
	content: string;
}

export interface ScreenshotData {
	url: string;
	second: number;
	image_url: string;
}

export interface ScreenshotMultipleData {
	url: string;
	image_urls: string[];
	seconds: number[];
}

export interface Comment {
	id: string;
	videoId: string;
	textOriginal: string;
	authorDisplayName: string;
	likeCount: number;
	publishedAt: string;
	totalReplyCount: number;
	replies?: Comment[];
}

export interface CommentsData {
	nextPageToken?: string;
	data: Comment[];
}

export interface SearchResult {
	videoId: string;
	title: string;
	description: string;
	channelId: string;
	channelTitle: string;
	publishedAt: string;
	thumbnailUrl: string;
	duration?: string;
	viewCount?: number;
	likeCount?: number;
}

export interface SearchData {
	nextPageToken?: string;
	prevPageToken?: string;
	totalResults?: number;
	resultsPerPage?: number;
	items: SearchResult[];
}

export interface SummaryData {
	content: string;
}

export interface DownloadData {
	id: string;
	title: string;
	url: string;
	videoUrl: string;
	sourceId: string;
}

export interface AiModel {
	id: string;
	name: string;
	provider: string;
	description?: string;
}

export interface Video {
	id: string;
	sourceId: string;
	title: string;
	description?: string;
	duration: number;
	provider: string;
	channelId?: string;
	channelName?: string;
	thumbnailUrl?: string;
}
