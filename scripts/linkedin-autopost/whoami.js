/* eslint-disable */
// Verifies a LinkedIn token and prints the author URN to configure.
//
//   npm run linkedin:whoami
//
// Setup's most error-prone step is working out your own URN, so this derives
// it from the token rather than asking you to find it. Read-only — it calls
// /v2/userinfo and posts nothing.
const { loadEnvLocal } = require('./env');

loadEnvLocal();

const token = process.env.LINKEDIN_ACCESS_TOKEN;

async function main() {
  if (!token) {
    console.error('LINKEDIN_ACCESS_TOKEN is not set.');
    console.error('Add it to .env.local (gitignored) or export it, then re-run.');
    process.exit(1);
  }

  const res = await fetch('https://api.linkedin.com/v2/userinfo', {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 401) {
    console.error('401 Unauthorized — the token is invalid or has expired.');
    console.error('LinkedIn member tokens last ~60 days; generate a fresh one.');
    process.exit(1);
  }
  if (res.status === 403) {
    console.error('403 Forbidden — the token is valid but lacks the openid/profile scopes,');
    console.error('so the URN cannot be read from it. Regenerate the token with');
    console.error('"openid", "profile" and "w_member_social" all selected.');
    process.exit(1);
  }
  if (!res.ok) {
    console.error(`Unexpected ${res.status} ${res.statusText}: ${(await res.text()).slice(0, 300)}`);
    process.exit(1);
  }

  const me = await res.json();
  if (!me.sub) {
    console.error(`No "sub" claim in the response: ${JSON.stringify(me).slice(0, 300)}`);
    process.exit(1);
  }

  console.log('Token is valid.\n');
  console.log(`  Name : ${me.name || '(not shared by this token)'}`);
  console.log(`  Email: ${me.email || '(not shared by this token)'}`);
  console.log('\nSet this as LINKEDIN_AUTHOR_URN:\n');
  console.log(`  urn:li:person:${me.sub}\n`);
  console.log('Note: this endpoint confirms identity, not posting rights. If the token was');
  console.log('generated without w_member_social, publishing will still fail with a 403.');
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
