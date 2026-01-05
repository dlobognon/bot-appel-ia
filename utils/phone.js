/**
 * Normalise un numéro ivoirien au format E.164 pour Twilio.
 * Côte d'Ivoire : +225 + 10 chiffres (depuis 31/01/2021).
 * Exemple: 07xxxxxxxx -> +22507xxxxxxxx
 * Accepte:
 *  - +22507xxxxxxxx
 *  - 22507xxxxxxxx
 *  - 07xxxxxxxx
 *  - 7xxxxxxxx (best effort)
 */
function normalizeCINumber(input) {
  if (!input) return '';
  let s = input.toString().trim().replace(/[\s\-\.()]/g, '');

  // Already E.164
  if (s.startsWith('+225')) return s;

  // Remove +
  if (s.startsWith('+')) s = s.slice(1);

  // Remove country code if present
  if (s.startsWith('225')) s = s.slice(3);

  const digits = s.replace(/\D/g, '');

  // NSN 10 digits (new plan)
  if (digits.length === 10) return `+225${digits}`;

  // Old plan 8 digits (best effort)
  if (digits.length === 8) return `+225${digits}`;

  // Best effort fallback
  return digits ? `+225${digits}` : '';
}

module.exports = { normalizeCINumber };
