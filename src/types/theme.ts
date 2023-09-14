import type { CurrentSettings } from 'src/settings/settings';

export type Tidy5eTheme = {
  id: string;
  name: string;
  description: string;
  variables: Record<string, string>;
};

export type ThemeColorSetting = {
  name: string;
  hint: string;
  key: keyof CurrentSettings;
  cssVariable: string;
};
