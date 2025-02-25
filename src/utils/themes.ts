// src/utils/themes.ts
import { createTheme, createText, createBox } from '@shopify/restyle';

const palette = {
  purpleLight: '#8C6FF7',
  purplePrimary: '#5A31F4',
  purpleDark: '#3F22AB',

  greenLight: '#56DCBA',
  greenPrimary: '#0ECD9D',
  greenDark: '#0A6F5E',

  black: '#0B0B0B',
  white: '#FFFFFF',
  
  grayLight: '#F5F5F5',
  grayMedium: '#C7C7C7',
  grayDark: '#595959',
};

const theme = createTheme({
  colors: {
    mainBackground: palette.grayLight,
    mainForeground: palette.black,
    primaryCardBackground: palette.purplePrimary,
    secondaryCardBackground: palette.greenPrimary,
    cardText: palette.white,
    text: palette.black,
  },
  spacing: {
    s: 8,
    m: 16,
    l: 24,
    xl: 40,
  },
  borderRadii: {
    s: 4,
    m: 10,
    l: 25,
    xl: 40,
  },
  textVariants: {
    header: {
      fontWeight: 'bold',
      fontSize: 34,
      lineHeight: 42,
      color: 'mainForeground',
    },
    subheader: {
      fontWeight: '600',
      fontSize: 28,
      lineHeight: 36,
      color: 'mainForeground',
    },
    body: {
      fontSize: 16,
      lineHeight: 24,
      color: 'mainForeground',
    },
    smallBody: {
      fontSize: 14,
      lineHeight: 20,
      color: 'mainForeground',
    },
  },
});

export type Theme = typeof theme;
export const Text = createText<Theme>();
export const Box = createBox<Theme>();

export default theme;