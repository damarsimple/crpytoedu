import { NoSsr } from "@mui/material";
import { ApexOptions } from "apexcharts";
import React from "react";
import Chart from "react-apexcharts";

interface Props {
  type?:
    | "line"
    | "area"
    | "bar"
    | "histogram"
    | "pie"
    | "donut"
    | "radialBar"
    | "scatter"
    | "bubble"
    | "heatmap"
    | "treemap"
    | "boxPlot"
    | "candlestick"
    | "radar"
    | "polarArea"
    | "rangeBar";
  series?: Array<any>;
  width?: string | number;
  height?: string | number;
  options?: ApexOptions;
  [key: string]: any;
}

export default function ChartComponent(e: Props) {
  return (
    <>
      <NoSsr>
        <Chart {...e} />
      </NoSsr>
    </>
  );
}
