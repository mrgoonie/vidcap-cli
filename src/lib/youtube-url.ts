export function buildYoutubeWatchUrl(videoId: string): string {
	return `https://www.youtube.com/watch?v=${videoId}`;
}

export function attachYoutubeUrls<T extends { videoId: string; url?: string }>(
	items: T[]
): Array<T & { url: string }> {
	return items.map((item) => ({
		...item,
		url: item.url || buildYoutubeWatchUrl(item.videoId),
	}));
}
