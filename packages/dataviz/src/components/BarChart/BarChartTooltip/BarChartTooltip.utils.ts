import i18next from 'i18next';
import { ChartEntry, DataType } from '../barChart.types';
import { TooltipEntry } from '../../Tooltip/Tooltip.component';

export function getFilteredValueLabel(dataType: DataType): string {
	return {
		[DataType.MIN]: i18next.t('MIN_MATCHING_FILTER', {
			defaultValue: 'Min matching your filter',
		}),
		[DataType.MAX]: i18next.t('MAX_MATCHING_FILTER_MAX', {
			defaultValue: 'Max matching your filter',
		}),
		[DataType.AVERAGE]: i18next.t('AVERAGE_MATCHING_FILTER', {
			defaultValue: 'Average matching your filter',
		}),
		[DataType.SUM]: i18next.t('SUM_MATCHING_FILTER', {
			defaultValue: 'Sum matching your filter',
		}),
		[DataType.OCCURRENCES]: i18next.t('OCCURRENCES_MATCHING_FILTER', {
			defaultValue: 'Occurrences matching your filter',
		}),
	}[dataType];
}

export function getDatasetValueLabel(dataType: DataType, hasFilteredValue: boolean): string {
	let label;
	/**
	 *  We want t(XX, {defaultValue: YY}) instead of constants so it can be picked up by i18n-scanner
	 */
	switch (dataType) {
		case DataType.MIN:
			label = i18next.t('MIN', {
				defaultValue: 'Min',
			});
			break;
		case DataType.MAX:
			label = i18next.t('MAX', {
				defaultValue: 'Max',
			});
			break;
		case DataType.AVERAGE:
			label = i18next.t('AVERAGE', {
				defaultValue: 'Average',
			});
			break;
		case DataType.SUM:
			label = i18next.t('SUM', {
				defaultValue: 'Sum',
			});
			break;
		case DataType.OCCURRENCES:
			label = hasFilteredValue
				? i18next.t('OCCURRENCES_IN_DATASET', {
						defaultValue: 'Occurrences in entire dataset',
				  })
				: i18next.t('SUM', {
						defaultValue: 'Occurrences',
				  });
			break;
		default:
			label = dataType;
	}
	return label;
}

export function formatFilteredValue(filteredValue: number, value?: number): string {
	let label = filteredValue.toLocaleString();
	if (value) {
		const percentage = ((filteredValue / value) * 100).toFixed(1);
		label = `${label} (${percentage}%)`;
	}
	return label;
}

export function getToolTipContent(entry: ChartEntry<string>, dataType: DataType): TooltipEntry[] {
	const tooltipLines: TooltipEntry[] = [];

	if (entry.filteredValue != null) {
		tooltipLines.push({
			key: getFilteredValueLabel(dataType),
			value: formatFilteredValue(entry.filteredValue, entry.value),
		});
	}

	if (entry.value != null) {
		tooltipLines.push({
			key: getDatasetValueLabel(dataType, entry.filteredValue != null),
			value: entry.value.toLocaleString(),
		});
	}

	tooltipLines.push({
		key: i18next.t('RECORD', {
			defaultValue: 'Record',
		}),
		value:
			entry.key ||
			i18next.t('EMPTY', {
				defaultValue: 'Empty',
			}),
	});
	return tooltipLines;
}
