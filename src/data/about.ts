// PRERENDER CONTRACT — scripts/prerender.js slices this file between
//   `export const aboutParagraphs: string[] =`  and  `export const aboutIntro`
// and evaluates the slice as plain JavaScript. Inside the array literal:
//   no imports, no identifiers from other modules, no `as const`,
//   no enums / satisfies / type assertions, no template literals that
//   interpolate anything — plain string literals only.
// Helpers and anything clever go BELOW the `export const aboutIntro` sentinel.

/**
 * First-person narrative, kept as data so the React page and the prerendered
 * HTML read from one source.
 *
 * This exists because an audit of the site reported `has_personal_voice: false`
 * even though the home page already opened in the first person. The signal it
 * appears to look for is an explicit About block, not pronoun usage — so there
 * is now a real one, under a real <h2>About</h2>, on the home page and at
 * /about.
 *
 * Written in Michael's voice and kept to things already public elsewhere on the
 * site: the finance-to-agent-layer through-line, the deal table, the essays.
 */
export const aboutParagraphs: string[] = [
  "I build AI agents that run in production. Most of what that involves is not the model — it is the tool surface the model is allowed to call, the evidence the system has to produce afterwards, and the gates that stop it doing anything it cannot undo.",
  "I came to it sideways. I spent years in corporate finance and strategy — capital markets, divestitures, an IPO, a $4B share repurchase — and the through-line is the same in both halves of that career: the number has to reconcile, and somebody has to be able to check it eighteen months later. That instinct turns out to be exactly what an agent needs before it can go anywhere near a regulated decision.",
  "So I can price a system and I can ship it. I have authored Terraform modules with multi-environment remote state and run production Kubernetes; I have also built the financial model a private-equity board expected. Very few people building agent infrastructure can also make the business case for it, and that combination is the whole of what I am useful for.",
  "I write about the parts that went wrong, because those are the parts worth reading. The statistical gate I built for my own agent's instruction file turned out to be decorative once I ran the power calculation on it. A pipeline I looked at daily was quietly rewriting its own history until I added one more file. Both are on this site with the arithmetic shown.",
];

export const aboutIntro =
  'Technical product manager at the agent layer. Atlanta, relocating to New York City.';
