export function parseBoolean(value: string | boolean): boolean {
	if (typeof value === 'boolean') {
		return value;
	}

	if (typeof value === 'string') {
		const lowerCaseValue = value.trim().toLowerCase();
		if (lowerCaseValue === 'true') {
			return true;
		}
		if (lowerCaseValue === 'false') {
			return false;
		}
		throw new Error(`Can't convert to boolean: ${value}`);
	}

	throw new Error(`Value: ${JSON.parse(value)} most be a boolean or a string`);
}
