/* eslint-disable */
// Loads .env.local into process.env for local runs.
//
// CRA reads .env.local for the browser bundle, but these scripts run in plain
// Node, which doesn't. This keeps the credentials in one familiar, gitignored
// place instead of requiring them to be exported by hand every session.
// Real environment variables always win, so CI (which sets them properly)
// is unaffected.
const fs = require('fs');
const path = require('path');

const ENV_FILE = path.join(__dirname, '..', '..', '.env.local');

function loadEnvLocal() {
  if (!fs.existsSync(ENV_FILE)) return;

  fs.readFileSync(ENV_FILE, 'utf8')
    .split('\n')
    .forEach((raw) => {
      const line = raw.trim();
      if (!line || line.startsWith('#')) return;

      const eq = line.indexOf('=');
      if (eq === -1) return;

      const key = line.slice(0, eq).trim();
      let value = line.slice(eq + 1).trim();
      // Tolerate quoted values; tokens don't contain quotes but people paste them anyway.
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (key && !(key in process.env)) process.env[key] = value;
    });
}

module.exports = { loadEnvLocal, ENV_FILE };
