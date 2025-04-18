// react-native-circular-slider.d.ts
declare module "react-native-circular-slider" {
    import * as React from "react";
    import { ViewProps } from "react-native";
    
    export interface CircularSliderProps extends ViewProps {
      value?: number;
      onChange?: (value: number) => void;
      strokeWidth?: number;
      strokeColor?: string;
      backgroundColor?: string;
      size?: number;
      // Add any additional props you use...
    }
    
    const CircularSlider: React.FC<CircularSliderProps>;
    export default CircularSlider;
  }
  