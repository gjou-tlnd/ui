import React from 'react';
import { Meta, Story } from '@storybook/react';
import BarCharTooltip, { BarCharTooltipProps } from './BarChartTooltip.component';
import { DataType } from '../barChart.types';

const Template: Story<BarCharTooltipProps> = args => <BarCharTooltip {...args} />;

export default {
	title: 'Dataviz/HorizontalBarChartTooltip',
	component: BarCharTooltip,
} as Meta<BarCharTooltipProps>;

export const OccurrencesInDataset = Template.bind({});
OccurrencesInDataset.args = {
	dataType: DataType.OCCURRENCES,
	entry: {
		value: 20,
		key: 'France',
	},
};

export const OccurrencesWithFilter = Template.bind({});
OccurrencesWithFilter.args = {
	dataType: DataType.OCCURRENCES,
	entry: {
		value: 20,
		key: 'France',
		filteredValue: 10,
	},
};

export const AggregationOnDataset = Template.bind({});
AggregationOnDataset.args = {
	dataType: DataType.MAX,
	entry: {
		value: 20,
		key: 'France',
	},
};

export const AggregationWithFilter = Template.bind({});
AggregationWithFilter.args = {
	dataType: DataType.MAX,
	entry: {
		key: 'France',
		filteredValue: 10,
	},
};
