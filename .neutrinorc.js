const standard = require('@neutrinojs/standardjs');
const vue = require('@neutrinojs/vue');

module.exports = {
  options: {
    root: __dirname,
  },
  use: [
    standard(),
    vue({
      html: {
        title: 'davblog'
      }
    }),
  ],
};
