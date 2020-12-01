/**
 * Item to display in the charts.
 * We can have both dataset & filtered values, or only one of them
 */
export type ChartEntry<U> = {
	key: U;
} & ({ value: number; filteredValue?: number } | { value?: number; filteredValue: number });

export enum DataType {
	MIN = 'MIN',
	MAX = 'MAX',
	SUM = 'SUM',
	AVERAGE = 'AVERAGE',
	OCCURRENCES = 'OCCURRENCES',
}
