const { createJestConfig } = require('./test/createJestConfig');

module.exports = createJestConfig({
  displayName: 'w3security',
  projects: ['<rootDir>', '<rootDir>/packages/*'],
});
