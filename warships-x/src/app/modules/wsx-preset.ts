import Lara from '@primeng/themes/lara';
import { definePreset } from '@primeng/themes';

const primaryColor = 'teal';
const secondaryColor = 'zinc';

export const WsxPreset = definePreset(Lara, {
  semantic: {
    colorScheme: {
      surface: {
        0: `#ffffff`,
        50: `{${secondaryColor}.50}`,
        100: `{${secondaryColor}.100}`,
        200: `{${secondaryColor}.200}`,
        300: `{${secondaryColor}.300}`,
        400: `{${secondaryColor}.400}`,
        500: `{${secondaryColor}.500}`,
        600: `{${secondaryColor}.600}`,
        700: `{${secondaryColor}.700}`,
        800: `{${secondaryColor}.800}`,
        900: `{${secondaryColor}.900}`,
        950: `{zinc.950}`,
      },
    },
    primary: {
      50: `{${primaryColor}.50}`,
      100: `{${primaryColor}.100}`,
      200: `{${primaryColor}.200}`,
      300: `{${primaryColor}.300}`,
      400: `{${primaryColor}.400}`,
      500: `{${primaryColor}.500}`,
      600: `{${primaryColor}.600}`,
      700: `{${primaryColor}.700}`,
      800: `{${primaryColor}.800}`,
      900: `{${primaryColor}.900}`,
      950: `{${primaryColor}.950}`,
    },
  },
});
