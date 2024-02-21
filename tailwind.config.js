const { withAnimations } = require('animated-tailwindcss');
/** @type {import('tailwindcss').Config} */
module.exports = withAnimations({
  content: ['./src/**/*.{js,ts,vue,tsx}'],
  darkMode: 'media',
  theme: {
    extend: {
      fontFamily: {
        rubik: ['Font-Rubik'],
        'rubik-italic': ['Font-Rubik-Italic'],
        robot: ['Roboto'],
        'robot-regular': ['Roboto-Regular', 'Robot'],
        'robot-medium': ['Roboto-Medium', 'Robot'],
        'robot-bold': ['Roboto-Bold', 'Roboto'],
        din: ['D-DIN'],
        'din-bold': ['D-DIN-Bold'],
      },
    },
  },
  corePlugins: {
    preflight: false,
  },
});
