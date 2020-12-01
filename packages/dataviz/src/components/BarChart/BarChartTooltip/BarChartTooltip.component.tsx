import React from 'react';
import BarTooltip from '../../Tooltip/Tooltip.component';
import { ChartEntry, DataType } from '../barChart.types';
import { getToolTipContent } from './BarChartTooltip.utils';

export type BarCharTooltipProps = {
	entry?: ChartEntry<string>;
	dataType: DataType;
};

function BarCharTooltip({ dataType, entry }: BarCharTooltipProps) {
	if (entry) {
		return <BarTooltip entries={getToolTipContent(entry, dataType)} />;
	}
	return null;
}

export default BarCharTooltip;
