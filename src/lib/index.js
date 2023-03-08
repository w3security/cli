const w3securityConfig = require('./config');

// This module is kind of "world object" that is used to indirectly import modules.
// This also introduces some circular imports.

// TODO(kyegupov): untangle this, resolve circular imports, convert to Typescript

const w3security = {};
module.exports = w3security;

w3security.id = w3securityConfig.id;

const apiToken = require('./api-token');

// make w3security.api *always* get the latest api token from the config store
Object.defineProperty(w3security, 'api', {
  enumerable: true,
  configurable: true,
  get: function () {
    return apiToken.api();
  },
  set: function (value) {
    w3securityConfig.api = value;
  },
});

w3security.test = require('./w3security-test');
w3security.policy = require('snyk-policy');

// this is the user config, and not the internal config
w3security.config = require('./user-config').config;
