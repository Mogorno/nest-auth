const timeUnitsMs = {
	week: 7 * 24 * 60 * 60 * 1000,
	day: 24 * 60 * 60 * 1000,
	hour: 60 * 60 * 1000,
	minute: 60 * 1000,
	second: 1000,
};

const timeUnitsVariantsMs = {
	w: timeUnitsMs.week,
	week: timeUnitsMs.week,
	weeks: timeUnitsMs.week,
	d: timeUnitsMs.day,
	day: timeUnitsMs.day,
	days: timeUnitsMs.day,
	h: timeUnitsMs.hour,
	hour: timeUnitsMs.hour,
	hours: timeUnitsMs.hour,
	m: timeUnitsMs.minute,
	min: timeUnitsMs.minute,
	minute: timeUnitsMs.minute,
	minutes: timeUnitsMs.minute,
	s: timeUnitsMs.second,
	second: timeUnitsMs.second,
	seconds: timeUnitsMs.second,
};

export const timeToMs = (input: string): number => {
	const regex =
		/(\d+)\s*(w|weeks?|d|days?|h|hours?|m|min|minutes?|s|seconds?)/gi;
	let totalMs = 0;
	let match: RegExpExecArray | null;

	while ((match = regex.exec(input)) !== null) {
		const [, value, unit] = match;
		totalMs += parseInt(value, 10) * timeUnitsVariantsMs[unit.toLowerCase()];
	}

	return totalMs;
};
