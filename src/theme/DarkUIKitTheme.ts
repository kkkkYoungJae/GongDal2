import createTheme from './createTheme';

const DarkUIKitTheme = createTheme({
  colorScheme: 'dark',
  colors: (palette) => {
    return {
      primary: palette.primary,
      secondary: palette.primary500,
      error: palette.red,
      background: palette.background600,
      text: palette.onBackgroundDark01,
      onBackground01: palette.onBackgroundDark01,
      onBackground02: palette.onBackgroundDark02,
      onBackground03: palette.onBackgroundDark03,
      onBackground04: palette.onBackgroundDark04,
      onBackgroundReverse01: palette.onBackgroundLight01,
      onBackgroundReverse02: palette.onBackgroundLight02,
      onBackgroundReverse03: palette.onBackgroundLight03,
      onBackgroundReverse04: palette.onBackgroundLight04,
      ui: {
        header: {
          nav: {
            none: {
              background: palette.background500,
              borderBottom: palette.onBackgroundDark04,
            },
          },
        },
        button: {
          contained: {
            enabled: {
              background: palette.primary500,
              content: palette.onBackgroundLight01,
            },
            pressed: {
              background: palette.primary700,
              content: palette.onBackgroundLight01,
            },
            disabled: {
              background: palette.background500,
              content: palette.onBackgroundDark04,
            },
          },
          text: {
            enabled: {
              background: palette.transparent,
              content: palette.primary500,
            },
            pressed: {
              background: palette.background400,
              content: palette.primary500,
            },
            disabled: {
              background: palette.transparent,
              content: palette.onBackgroundDark04,
            },
          },
        },
        dialog: {
          default: {
            none: {
              background: palette.background500,
              text: palette.onBackgroundDark01,
              message: palette.onBackgroundDark02,
              highlight: palette.primary500,
              destructive: palette.red,
              blurred: palette.onBackgroundDark04,
            },
          },
        },
        input: {
          default: {
            active: {
              text: palette.onBackgroundDark01,
              placeholder: palette.onBackgroundDark03,
              background: palette.background400,
              highlight: palette.primary500,
            },
            disabled: {
              text: palette.onBackgroundDark04,
              placeholder: palette.onBackgroundDark04,
              background: palette.background400,
              highlight: palette.onBackgroundDark04,
            },
          },
          underline: {
            active: {
              text: palette.onBackgroundDark01,
              placeholder: palette.onBackgroundDark03,
              background: palette.transparent,
              highlight: palette.primary500,
            },
            disabled: {
              text: palette.onBackgroundDark04,
              placeholder: palette.onBackgroundDark04,
              background: palette.transparent,
              highlight: palette.onBackgroundDark04,
            },
          },
        },
        badge: {
          default: {
            none: {
              text: palette.background600,
              background: palette.primary500,
            },
          },
        },
        placeholder: {
          default: {
            none: {
              content: palette.onBackgroundDark03,
              highlight: palette.primary500,
            },
          },
        },
      },
    };
  },
});

export default DarkUIKitTheme;
