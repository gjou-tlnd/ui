import React from 'react';
import { Meta, Story } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import HorizontalBarChart, {
	ChartStyle,
	HorizontalBarChartProps,
} from './HorizontalBarChart.component';
import { ChartEntry } from '../barChart.types';

const data: ChartEntry<string>[] = [
	{
		key: 'Entry fully matching filter',
		value: 2145,
		filteredValue: 2145,
	},
	{
		key: 'Entry not matching filter',
		value: 1500,
		filteredValue: 0,
	},
	{
		key: 'Entry partially matching filter',
		value: 3200,
		filteredValue: 2080,
	},
];

const Template: Story<HorizontalBarChartProps> = args => <HorizontalBarChart {...args} />;

export default {
	title: 'Dataviz/HorizontalBarChart',
	component: HorizontalBarChart,
	decorators: [
		ChartStory => (
			<div style={{ height: 400, width: 400 }}>
				<ChartStory />
			</div>
		),
	],
	args: {
		data,
		onClick: action('onCick'),
	},
} as Meta<HorizontalBarChartProps>;

export const ProfileWithoutFilter = Template.bind({});
ProfileWithoutFilter.args = {
	chartStyle: ChartStyle.VALUE,
	data: [
		{
			key: 'Entry',
			value: 2500,
		},
	],
};

export const ProfileWithFilter = Template.bind({});
ProfileWithFilter.args = {
	chartStyle: ChartStyle.VALUE,
};

export const Pattern = Template.bind({});
Pattern.args = {
	chartStyle: ChartStyle.PATTERN,
};

export const MinBarSize = Template.bind({});
MinBarSize.parameters = {
	docs: {
		storyDescription: 'Bars should not stretch and label should overflow',
	},
};
MinBarSize.args = {
	chartStyle: ChartStyle.PATTERN,
	data: [
		{
			key: 'Min bar size',
			value: 1,
		},
		{
			key: 'Long bar',
			value: 1000,
			filteredValue: 500,
		},
	],
};

export const TooManyBars = Template.bind({});
TooManyBars.parameters = {
	docs: {
		storyDescription: 'Bars should not shrink',
	},
};
TooManyBars.args = {
	chartStyle: ChartStyle.PATTERN,
	data: [...Array(10)].flatMap(() => data),
};

export const EmptyValue = Template.bind({});
EmptyValue.parameters = {
	docs: {
		storyDescription: 'Should show empty label',
	},
};
EmptyValue.args = {
	chartStyle: ChartStyle.PATTERN,
	data: [
		{
			value: 50,
			key: '',
		},
	],
};
