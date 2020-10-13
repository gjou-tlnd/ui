import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import RadarChart from '.';

const ExampleDataSingle = [
	{ axis: 'Validity', A: 4 },
	{ axis: 'Popularity', A: 3 },
	{ axis: 'Completeness', A: 2 },
	{ axis: 'Discoverability', A: 1 },
	{ axis: 'Usage', A: 1 },
];

const ExampleDataMultiple = [
	{ axis: 'Validity', A: 4, B: 2 },
	{ axis: 'Popularity', A: 3, B: 5 },
	{ axis: 'Completeness', A: 2, B: 1 },
	{ axis: 'Discoverability', A: 1, B: 3 },
	{ axis: 'Usage', A: 1, B: 3 },
];

const ExampleDataClickable = [
	{ axis: 'Validity', A: 4 },
	{ axis: 'Popularity', A: 3 },
	{ axis: 'Completeness', A: 2 },
	{ axis: 'Discoverability', A: 1 },
	{ axis: 'Usage', A: 1 },
];

const chartDomain = [0, 5];
const activeAxis = 2;

const stories = storiesOf('Data/Dataviz/RadarChart', module);
stories
	.addDecorator(story => <div className="col-lg-12">{story()}</div>)
	.add('Radar Chart Single', () => (
		<div>
			<h2>Single Object</h2>
			<p>A radar chart showing axis scores for a single object</p>
			<RadarChart data={ExampleDataSingle} domain={chartDomain}>
				<RadarChart.PolarAngleAxis dataKey="axis" />
				<RadarChart.Radar
					name="Trust score"
					dataKey="A"
					dot={true}
					stroke="#19426c"
					fill="#19426c"
					fillOpacity={0.1}
				/>
			</RadarChart>
		</div>
	))
	.add('Radar Chart Multiple', () => (
		<div>
			<h2>Multiple Objects</h2>
			<p>A radar chart showing axis scores for more than one object</p>
			<RadarChart data={ExampleDataMultiple} domain={chartDomain}>
				<RadarChart.PolarAngleAxis dataKey="axis" />
				<RadarChart.Radar
					name="Trust score 2019"
					dataKey="A"
					dot={false}
					stroke="#19426c"
					fill="#19426c"
					fillOpacity={0.1}
				/>
				<RadarChart.Radar
					name="Trust score 2020"
					dataKey="B"
					dot={false}
					stroke="#EA8330"
					fill="#EA8330"
					fillOpacity={0.1}
				/>
			</RadarChart>
		</div>
	))
	.add('Radar Chart Clickable Label', () => (
		<div>
			<h2>Clickable labels</h2>
			<p>A radar chart with clickable axis labels</p>
			<RadarChart data={ExampleDataClickable} domain={chartDomain}>
				<RadarChart.PolarAngleAxis
					dataKey="axis"
					tick={<RadarChart.LabelWithClick activeAxis={2} />}
					onClick={action('Axis label was clicked')}
				/>
				<RadarChart.Radar
					dataKey="A"
					dot={false}
					fill="#19426c"
					fillOpacity={0.1}
					name="Trust score"
					stroke="#19426c"
				/>
			</RadarChart>
		</div>
	))
	.add('Radar Chart Clickable Dot', () => (
		<div>
			<h2>Clickable dot</h2>
			<p>A radar chart with clickable dots</p>
			<RadarChart data={ExampleDataClickable} domain={chartDomain}>
				<RadarChart.PolarAngleAxis dataKey="axis" />
				<RadarChart.Radar
					dataKey="A"
					dot={<RadarChart.DotWithClick activeAxis={2} onClick={action('Axis dot was clicked')} />}
					fill="#19426c"
					fillOpacity={0.1}
					name="Trust score"
					stroke="#19426c"
				/>
			</RadarChart>
		</div>
	))
	.add('Radar Chart Custom Dot', () => (
		<div>
			<h2>Custom dot element</h2>
			<p>A radar chart with custom dots</p>
			<RadarChart data={ExampleDataClickable} domain={chartDomain}>
				<RadarChart.PolarAngleAxis dataKey="axis" />
				<RadarChart.Radar
					dataKey="A"
					dot={<RadarChart.Dot activeAxis={2} />}
					fill="#19426c"
					fillOpacity={0.1}
					name="Trust score"
					stroke="#19426c"
				/>
			</RadarChart>

			<div>
				<p id="clickMessage"></p>
			</div>
		</div>
	));
