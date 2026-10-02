/**
 * Prints the comment "crew" key for one person: HMAC-SHA256(MODERATION_HMAC_KEY, "team:<subdomain>").
 * Open https://vecia.fr/?team_key=<key> once in your browser: the comment form then posts with the crew badge.
 *
 *   infisical-run -p /vecia-website -- node scripts/team-key.mjs alexandre
 */
import { createHmac } from 'node:crypto';

const subdomain = process.argv[2];
const key = process.env.MODERATION_HMAC_KEY;
if (!subdomain || !key) {
  console.error('usage: MODERATION_HMAC_KEY=... node scripts/team-key.mjs <subdomain>');
  process.exit(1);
}
console.log(createHmac('sha256', key).update(`team:${subdomain}`).digest('hex'));
