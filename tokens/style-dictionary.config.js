/**
 * Style Dictionary Configuration
 *
 * Transforms W3C DTCG tokens to Tailwind @theme format
 */

export default {
  source: ['tokens/tokens.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'tokens/',
      files: [
        {
          destination: 'generated-theme.css',
          format: 'css/tailwind-theme',
          options: {
            outputReferences: true,
          },
        },
      ],
    },
  },
};
