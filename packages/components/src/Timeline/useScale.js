import React, { useMemo } from 'react';
import format from 'date-fns/format';
import { useTranslation } from 'react-i18next';

import getLocale from '../DateFnsLocale/locale';

const MILLISECONDS_IN_MINUTE = 60 * 1000;
const MILLISECONDS_IN_HOUR = 60 * MILLISECONDS_IN_MINUTE;
const MILLISECONDS_IN_DAY = 24 * MILLISECONDS_IN_HOUR;
const MILLISECONDS_IN_3_DAYS = 3 * MILLISECONDS_IN_DAY;

export const SCALE_MODES = {
	MINUTES: 'MINUTES',
	TWO_MINUTES: '2MINUTES',
	FIVE_MINUTES: '5MINUTES',
	TEN_MINUTES: '10MINUTES',
	QUARTER_HOUR: 'QUARTER_HOUR',
	HALF_HOUR: 'HALF_HOUR',
	HOURS: 'HOURS',
	TWO_HOURS: '2HOURS',
	THREE_HOURS: '3HOURS',
};

const BASE_MODES = [SCALE_MODES.FIVE_MINUTES, SCALE_MODES.HOURS];

const STEPS = {
	// base 5min
	[SCALE_MODES.MINUTES]: MILLISECONDS_IN_MINUTE,
	[SCALE_MODES.TWO_MINUTES]: 2 * MILLISECONDS_IN_MINUTE,
	[SCALE_MODES.FIVE_MINUTES]: 5 * MILLISECONDS_IN_MINUTE,
	[SCALE_MODES.TEN_MINUTES]: 10 * MILLISECONDS_IN_MINUTE,

	// base hour
	[SCALE_MODES.QUARTER_HOUR]: 15 * MILLISECONDS_IN_MINUTE,
	[SCALE_MODES.HALF_HOUR]: 30 * MILLISECONDS_IN_MINUTE,
	[SCALE_MODES.HOURS]: MILLISECONDS_IN_HOUR,
	[SCALE_MODES.TWO_HOURS]: 2 * MILLISECONDS_IN_HOUR,
	[SCALE_MODES.THREE_HOURS]: 3 * MILLISECONDS_IN_HOUR,
};

const UNIT_FORMATS = {
	[SCALE_MODES.MINUTES]: { long: 'HH:mm', short: 'mm' },
	[SCALE_MODES.TWO_MINUTES]: { long: 'HH:mm', short: 'mm' },
	[SCALE_MODES.FIVE_MINUTES]: { long: 'HH:mm', short: 'mm' },
	[SCALE_MODES.TEN_MINUTES]: { long: 'HH:mm', short: 'mm' },

	[SCALE_MODES.QUARTER_HOUR]: { long: 'HH:mm', short: 'mm' },
	[SCALE_MODES.HALF_HOUR]: { long: 'HH:mm', short: 'mm' },
	[SCALE_MODES.HOURS]: { long: 'HH:mm', short: 'HH' },
	[SCALE_MODES.TWO_HOURS]: { long: 'HH:mm', short: 'HH' },
	[SCALE_MODES.THREE_HOURS]: { long: 'HH:mm', short: 'HH' },
};

function getIntervals(timeRange, step, locale, localFormats) {
	const [startTimestamp, endTimestamp] = timeRange;
	if (!startTimestamp || !endTimestamp) {
		return { days: [], hours: [] };
	}

	const timeUnits = new Array((endTimestamp - startTimestamp) / step).fill(0).map((_, index) => {
		const unitStartTimestamp = startTimestamp + index * step;
		const unitEndTimestamp = unitStartTimestamp + step;

		const startDate = new Date(unitStartTimestamp);
		const endDate = new Date(unitEndTimestamp);
		const isNewDate =
			index === 0 ||
			(startDate.getHours() === 0 && startDate.getMinutes() === 0 && startDate.getMinutes() === 0);

		const startLabels = {
			long: format(startDate, localFormats.long, locale),
			short: format(startDate, localFormats.short, locale),
		};
		const endLabels = {
			long: format(endDate, localFormats.long, locale),
			short: format(endDate, localFormats.short, locale),
		};

		return { start: unitStartTimestamp, end: unitEndTimestamp, startLabels, endLabels, isNewDate };
	});

	const days = timeUnits.reduce((accu, unitDefinition) => {
		const { start, isNewDate } = unitDefinition;
		if (isNewDate) {
			accu.push({ start, label: format(start, 'DD MMM YYYY', locale), count: 1 });
		} else {
			accu[accu.length - 1].count++;
		}
		return accu;
	}, []);

	return { days, timeUnits };
}

function getScaleMode(timeRange, zoom) {
	const [startTimestamp, endTimestamp] = timeRange;
	const isAtLeast3Days = endTimestamp - startTimestamp >= MILLISECONDS_IN_3_DAYS;
	const isAtLeastADay = endTimestamp - startTimestamp >= MILLISECONDS_IN_DAY;
	console.log(zoom);

	// between 1 et 3 days
	// base scale is hour
	if (isAtLeastADay) {
		if (zoom < 0.5) {
			return SCALE_MODES.THREE_HOURS;
		}
		if (zoom < 1) {
			return SCALE_MODES.TWO_HOURS;
		}
		if (zoom < 1.7) {
			return SCALE_MODES.HOURS;
		}
		if (zoom < 2.5) {
			return SCALE_MODES.HALF_HOUR;
		}
		return SCALE_MODES.QUARTER_HOUR;
	}

	// less than a day
	// base scale is 5 minutes
	if (zoom < 1) {
		return SCALE_MODES.TEN_MINUTES;
	}
	if (zoom < 1.7) {
		return SCALE_MODES.FIVE_MINUTES;
	}
	if (zoom < 2.5) {
		return SCALE_MODES.TWO_MINUTES;
	}
	return SCALE_MODES.MINUTES;
}

function getTimeLabelFn(scaleMode, locale) {
	return function (timestamp) {
		const longLabel = format(timestamp, 'HH:mm', locale);

		if (BASE_MODES.includes(scaleMode) || new Date(timestamp).getMinutes() === 0) {
			return longLabel;
		}

		return (
			<>
				<span className="sr-only">{longLabel}</span>
				<span style={{ fontSize: '0.8em', opacity: '0.8', marginTop: '-0.5rem' }} aria-hidden>
					{format(timestamp, UNIT_FORMATS[scaleMode].short, locale)}
				</span>
			</>
		);
	};
}

export default function useScale(timeRange, zoom) {
	const { t } = useTranslation();
	const locale = useMemo(() => ({ locale: getLocale(t) }), [t]);
	const scaleMode = getScaleMode(timeRange, zoom);

	return useMemo(() => {
		const stepMs = STEPS[scaleMode];
		return {
			scaleMode,
			stepMs,
			getTimeLabel: getTimeLabelFn(scaleMode, locale),
			intervals: getIntervals(timeRange, stepMs, locale, UNIT_FORMATS[scaleMode]),
		};
	}, [timeRange, scaleMode]);
}
