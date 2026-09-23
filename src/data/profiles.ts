/**
 * The one place profile URLs are spelled. Every visible link and the Person
 * `sameAs` in public/index.html must agree byte-for-byte — search engines and
 * LLMs use that agreement to decide this site and these profiles are one entity
 * (there are eight other Michael Kaminskis on LinkedIn alone). scripts/prerender.js
 * keeps its own copies because it evals data files by marker; update both.
 */
export const PROFILES = {
  site: 'https://www.michael-kaminski.io',
  linkedin: 'https://www.linkedin.com/in/michaelxaxkaminski',
  github: 'https://github.com/MAKaminski',
  devto: 'https://dev.to/makaminski1337',
  x: 'https://x.com/EBITDA_Engineer',
  calendly: 'https://calendly.com/kaminski1337/15min',
  email: 'mkaminski1337@gmail.com',
} as const;
