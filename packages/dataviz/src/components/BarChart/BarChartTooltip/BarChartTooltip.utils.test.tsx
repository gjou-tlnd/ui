import {
	AggregationOnDataset,
	AggregationWithFilter,
	OccurrencesWithFilter,
} from './BarChartTooltip.stories';
import { getToolTipContent } from './BarChartTooltip.utils';

describe('BarChartTooltip', () => {
	it('Should return content for an aggregation on full dataset', () => {
		expect(
			getToolTipContent(AggregationOnDataset.args?.entry!, AggregationOnDataset.args?.dataType!),
		).toEqual([
			{ key: 'Max', value: '20' },
			{ key: 'Record', value: 'France' },
		]);
	});
	it('Should return content for an aggregation on filtered data', () => {
		expect(
			getToolTipContent(AggregationWithFilter.args?.entry!, AggregationWithFilter.args?.dataType!),
		).toEqual([
			{ key: 'Max matching your filter', value: '10' },
			{ key: 'Record', value: 'France' },
		]);
	});
	it('Should return a percentage when both filtered and full data are provided', () => {
		expect(
			getToolTipContent(OccurrencesWithFilter.args?.entry!, OccurrencesWithFilter.args?.dataType!),
		).toEqual([
			{ key: 'Occurrences matching your filter', value: '10 (50.0%)' },
			{ key: 'Occurrences in entire dataset', value: '20' },
			{ key: 'Record', value: 'France' },
		]);
	});
});
