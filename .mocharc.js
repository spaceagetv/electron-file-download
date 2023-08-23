/** @type {Mocha.MochaOptions} */
module.exports = {
  color: true,
  retries: process.env.CI ? 3 : 0,
  timeout: 10000,
  spec: './{,!(node_modules)/**}/*.test.?s',
  parallel: false,
  forbidOnly: process.env.CI ? true : false,
  require: ['ts-node/register'],
}