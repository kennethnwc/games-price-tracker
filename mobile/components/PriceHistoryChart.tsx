import { curveStepBefore, extent, line, scaleLinear } from "d3";
import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedProps,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import { parse, ReText, serialize } from "react-native-redash";
import Svg, { Path } from "react-native-svg";

import { Price } from "../screens/DetailScreen";
import { Cursor } from "./Cursor";

const AnimatedPath = Animated.createAnimatedComponent(Path);

const SIZE = Dimensions.get("window").width;

type Props = {
  prices: Price[];
};

const preProcessPrices = (prices: Price[]) => {
  let processed: { amount: number; processedDate: number }[] = [];
  let lastAmount = prices[0].amount;
  let firstAmount = prices[prices.length - 1].amount;
  let firstDate = prices[prices.length - 1].start_date;
  prices.forEach(({ amount, start_date }) => {
    processed.push({ amount, processedDate: new Date(start_date).getTime() });
  });

  processed = [{ amount: lastAmount, processedDate: new Date().getTime() }]
    .concat(processed)
    .concat([
      {
        amount: firstAmount,
        processedDate: new Date(firstDate).getTime() - 259200,
      },
    ]);

  return processed;
};

type ProcessedPrice = { amount: number; processedDate: number };
const height = 200;

const margin = { top: 10, bottom: 10, left: 10, right: 10 };
export const innerWidth = SIZE - margin.left - margin.right;
export const startWidth = margin.left;
export const innerHeight = height - margin.top - margin.bottom;
export const startHeight = margin.top;

export const PriceHisotryChart: React.FC<Props> = ({ prices }) => {
  const processedPrices = preProcessPrices(prices);

  const xValue = (d: ProcessedPrice) => d.processedDate;
  const xRange = (extent(processedPrices, (d) => d.processedDate) || [
    0, 0,
  ]) as [number, number];
  const xScale = scaleLinear().domain(xRange).range([startWidth, innerWidth]);

  const yValue = (d: ProcessedPrice) => d.amount;
  const yRange: [number, number] = (extent(
    processedPrices,
    (d) => d.amount
  ) || ["", ""]) as [number, number];

  const yScale = scaleLinear().domain(yRange).range([innerHeight, startHeight]);

  const path = parse(
    line<ProcessedPrice>()
      .x((d) => xScale(xValue(d)))
      .y((d) => yScale(yValue(d)))
      .curve(curveStepBefore)(processedPrices) || ""
  );
  const current = useSharedValue({ path: path });

  const animatedProps = useAnimatedProps(() => {
    return { d: serialize(path) };
  });

  const defaultX = xScale(processedPrices[0].processedDate);
  const defaultY = yScale(processedPrices[0].amount);
  const y = useSharedValue(defaultY);
  const x = useSharedValue(defaultX);

  const priceToShow = useDerivedValue(() => {
    const v = interpolate(y.value, [innerHeight, startHeight], yRange);
    return `HKD $ ${v.toLocaleString()}`;
  });

  const dateToShow = useDerivedValue(() => {
    const v = interpolate(x.value, [startWidth, innerWidth], xRange);
    return new Date(v).toDateString();
  });

  return (
    <View style={styles.container}>
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          marginHorizontal: 24,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            flex: 1,
            justifyContent: "space-between",
          }}
        >
          <ReText text={priceToShow} style={styles.price} />
        </View>

        <ReText text={dateToShow} style={styles.date} />
      </View>
      <View>
        <Svg width={innerWidth} height={innerHeight}>
          <AnimatedPath
            animatedProps={animatedProps}
            stroke="#5bd3c9"
            strokeWidth={5}
            fill="transparent"
          />
        </Svg>
        <Cursor
          data={current}
          y={y}
          x={x}
          defaultX={defaultX}
          defaultY={defaultY}
          minMaxX={[startWidth, innerWidth]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 20,
  },
  price: {
    fontSize: 24,
    fontWeight: "700",
    color: "#5bd3c9",
  },
  date: {
    color: "#5bd3c9",
  },
});
