export type PageAction = { type: string; payload?: any };
export type ForemanIntent = {
  action: string;
  target?: string;
  context?: Record<string, any>;
};
