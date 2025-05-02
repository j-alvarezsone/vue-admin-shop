import type { TOOLTIP_PLACEMENTS } from "../constants/tooltip";

export type ObjectValues<T> = T[keyof T];

export type TooltipPlacement = ObjectValues<typeof TOOLTIP_PLACEMENTS>;

export interface GenericOption {
  label: string
  value: string
}
