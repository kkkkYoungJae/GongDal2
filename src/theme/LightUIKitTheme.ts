import createTheme from './createTheme';

const LightUIKitTheme = createTheme({
  colorScheme: 'light',
  colors: (palette) => {
    return {
      primary: palette.primary,
      secondary: palette.primary500,
      error: palette.red,
      background: palette.background50,
      text: palette.onBackgroundLight01,
      onBackground01: palette.onBackgroundLight01,
      onBackground02: palette.onBackgroundLight02,
      onBackground03: palette.onBackgroundLight03,
      onBackground04: palette.onBackgroundLight04,
      onBackgroundReverse01: palette.onBackgroundDark01,
      onBackgroundReverse02: palette.onBackgroundDark02,
      onBackgroundReverse03: palette.onBackgroundDark03,
      onBackgroundReverse04: palette.onBackgroundDark04,
      ui: {
        header: {
          nav: {
            none: {
              background: palette.background50,
              borderBottom: palette.onBackgroundLight04,
            },
          },
        },
        button: {
          contained: {
            enabled: {
              background: palette.primary700,
              content: palette.onBackgroundDark01,
            },
            pressed: {
              background: palette.primary500,
              content: palette.onBackgroundDark01,
            },
            disabled: {
              background: palette.background100,
              content: palette.onBackgroundLight04,
            },
          },
          text: {
            enabled: {
              background: palette.transparent,
              content: palette.primary700,
            },
            pressed: {
              background: palette.transparent,
              content: palette.primary700,
            },
            disabled: {
              background: palette.transparent,
              content: palette.onBackgroundLight04,
            },
          },
        },
        dialog: {
          default: {
            none: {
              background: palette.background50,
              text: palette.onBackgroundLight01,
              message: palette.onBackgroundLight02,
              highlight: palette.primary700,
              destructive: palette.red,
              blurred: palette.onBackgroundLight04,
            },
          },
        },
        input: {
          default: {
            active: {
              text: palette.onBackgroundLight01,
              placeholder: palette.onBackgroundLight03,
              background: palette.background100,
              highlight: palette.primary700,
            },
            disabled: {
              text: palette.onBackgroundLight04,
              placeholder: palette.onBackgroundLight04,
              background: palette.background100,
              highlight: palette.onBackgroundLight04,
            },
          },
          underline: {
            active: {
              text: palette.onBackgroundLight01,
              placeholder: palette.onBackgroundLight03,
              background: palette.transparent,
              highlight: palette.primary700,
            },
            disabled: {
              text: palette.onBackgroundLight04,
              placeholder: palette.onBackgroundLight04,
              background: palette.transparent,
              highlight: palette.onBackgroundLight04,
            },
          },
        },
        badge: {
          default: {
            none: {
              text: palette.background50,
              background: palette.primary700,
            },
          },
        },
        placeholder: {
          default: {
            none: {
              content: palette.onBackgroundLight03,
              highlight: palette.primary700,
            },
          },
        },
      },
    };
  },
});

export default LightUIKitTheme;
