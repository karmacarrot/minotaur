import type { Preview } from '@storybook/react';
import { withThemeByClassName } from '@storybook/addon-themes';
const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    withThemeByClassName({ defaultTheme: 'light', themes: { light: 'light', dark: 'dark' } }),
  ],
};

export default preview;
