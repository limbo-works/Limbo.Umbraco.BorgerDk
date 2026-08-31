/** Formats a unix timestamp (seconds) the way the AngularJS views did: `yyyy-MM-dd HH:mm`. */
export function formatUnixDate(seconds: number): string {
	if (!seconds) return '';

	const date = new Date(seconds * 1000);
	const pad = (value: number) => value.toString().padStart(2, '0');

	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
