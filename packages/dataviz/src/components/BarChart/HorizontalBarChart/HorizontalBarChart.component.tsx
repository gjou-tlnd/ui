import React, { useMemo, useState } from 'react';
import classNames from 'classnames';
import {
	Bar,
	BarChart,
	CartesianGrid,
	Rectangle,
	RectangleProps,
	ResponsiveContainer,
	Text,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';
import { useTranslation } from 'react-i18next';
import BarChartTooltip from '../BarChartTooltip/BarChartTooltip.component';
import styles from './HorizontalBarChart.component.scss';
import { ChartEntry, DataType } from '../barChart.types';

const MIN_BAR_WIDTH = 3;
const BAR_GAP = 5;
const BAR_HEIGHT = 20;
const X_AXIS_TICKS_HEIGHT = 40;

export enum ChartStyle {
	VALUE = 'value',
	PATTERN = 'pattern',
}

const BLOCK_NAME = styles.moduleName;

export interface HorizontalBarChartProps {
	data: ChartEntry<string>[];
	dataType: DataType;
	onClick: (event: MouseEvent, key: string) => void;
	chartStyle: ChartStyle;
}

function HorizontalBarChart({ chartStyle, data, dataType, onClick }: HorizontalBarChartProps) {
	const [focusedBarIndex, setFocusedBarIndex] = useState(null);

	function onMouseMove(state: any) {
		setFocusedBarIndex(state.isTooltipActive ? state.activeTooltipIndex : undefined);
	}

	/**
	 * Primary bar shows
	 * - filtered data if any
	 * - unfiltered data otherwise
	 */
	function getPrimaryBarValue(entry: ChartEntry<string>): number {
		return entry.filteredValue != null ? entry.filteredValue : entry.value!;
	}

	/**
	 * Secondary bar shows data not matching filter (if any)
	 */
	function getSecondaryBarValue(entry: ChartEntry<string>): number | null {
		let value = null;
		if (entry.filteredValue != null && entry.value != null) {
			value = entry.value - entry.filteredValue;
		}
		return value;
	}

	return (
		<ResponsiveContainer>
			<FixedBarSizeWrapper data={data}>
				<BarChart
					className={classNames(styles[BLOCK_NAME], styles[`${BLOCK_NAME}--${chartStyle}`])}
					onMouseMove={onMouseMove}
					layout="vertical"
					onClick={(_, event: MouseEvent) => {
						if (focusedBarIndex) {
							onClick(event, data[focusedBarIndex!].key);
						}
					}}
					onMouseOut={() => setFocusedBarIndex(null)}
				>
					<CartesianGrid strokeDasharray="3 3" horizontal={false} />

					<XAxis dataKey="value" type="number" orientation="top" />

					<Bar
						dataKey={getPrimaryBarValue}
						stackId="1"
						shape={<BarRenderer focusedBarIndex={focusedBarIndex} barType="primary-bar" />}
					/>

					<Bar
						dataKey={getSecondaryBarValue}
						stackId="1"
						shape={<BarRenderer focusedBarIndex={focusedBarIndex} barType="secondary-bar" />}
					/>

					<Tooltip
						allowEscapeViewBox={{ x: false, y: true }}
						isAnimationActive={false}
						cursor={false}
						content={
							<BarChartTooltip
								dataType={dataType}
								entry={focusedBarIndex != null ? data[focusedBarIndex!] : undefined}
							/>
						}
					/>

					<YAxis
						// show label first in available
						dataKey="key"
						tickMargin={5}
						// don't show a dash before label
						tickLine={false}
						tick={<YAxisTick focusedBarIndex={focusedBarIndex} />}
						// non numeric label
						type="category"
						// show every label
						interval={0}
						// show label inside bar
						mirror
					/>
				</BarChart>
			</FixedBarSizeWrapper>
		</ResponsiveContainer>
	);
}

/**
 * Recharts fills provided height.
 * To display fixed height bar and gaps, we'll have to guess:
 * - min height fitting the provided data
 * - max number of bar fitting into the provided height
 */
interface FixedBarSizeWrapperProps {
	width?: number;
	height?: number;
	children: JSX.Element;
	data: ChartEntry<string>[];
}
function FixedBarSizeWrapper({ width, height = 0, children, data }: FixedBarSizeWrapperProps) {
	const neededHeight = Math.min(height, X_AXIS_TICKS_HEIGHT + data.length * (BAR_GAP + BAR_HEIGHT));

	const fittingData = useMemo(
		() => data.slice(0, Math.floor((height - X_AXIS_TICKS_HEIGHT) / (BAR_GAP + BAR_HEIGHT))),
		[data, height],
	);

	return React.cloneElement(children, {
		data: fittingData,
		width,
		height: neededHeight,
	});
}

function YAxisTick(props: any) {
	const [t] = useTranslation();
	return (
		<Text
			{...props}
			className={classNames(styles[`${BLOCK_NAME}__tick`], {
				[styles[`${BLOCK_NAME}__tick--hover`]]: props.payload.index === props.focusedBarIndex,
			})}
		>
			{/* use non-breaking spaces */
			props.payload.value
				? props.payload.value.replaceAll(' ', String.fromCharCode(160))
				: t('EMPTY', {
						defaultValue: 'Empty',
				  })}
		</Text>
	);
}

type BarRenderProps = RectangleProps & {
	focusedBarIndex: number | null;
	index?: number;
	barType: 'primary-bar' | 'secondary-bar';
};
function BarRenderer({ width, index, focusedBarIndex, barType, ...props }: BarRenderProps) {
	// We want all bar to be at least MIN_BAR_WIDTH long
	// but we can't use minPointSize: it would also be applied on empty bars
	const correctedWidth = !width ? 0 : Math.max(MIN_BAR_WIDTH, width);
	return (
		<Rectangle
			{...props}
			className={classNames(styles[`${BLOCK_NAME}__${barType}`], {
				[styles[`${BLOCK_NAME}__${barType}--hover`]]: focusedBarIndex === index,
			})}
			width={correctedWidth}
		/>
	);
}

export default Object.assign(HorizontalBarChart, {
	ChartStyle,
});
