export function parseStrArray(str: string) {
	if (typeof str !== 'string') {
		throw new Error(
			`Value: ${JSON.stringify(str)} with type: ${typeof str} must be a string`,
		);
	}

	return str.split(',').map((item) => {
		const trimmedItem = item.trim();

		if (!trimmedItem) {
			throw new Error(`Can't parse string: ${item} to array`);
		}

		return trimmedItem;
	});
}
