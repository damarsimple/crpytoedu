import { CSSProperties } from "react";

export interface TextProps {
  children: string;
  style?: CSSProperties;
  component: "span" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p";
  variant:
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "subtitle1"
    | "subtitle2"
    | "body1"
    | "body2"
    | "caption";
}

export interface ImageProps {
  type: string;
  src: string;
  width?: number;
  height?: number;
  style?: CSSProperties;
}

export interface ButtonProps {
  style?: CSSProperties;
  text: string;
  path?: string;
}
