let BOT_ENABLED = true;

function isBotEnabled() {
  return BOT_ENABLED;
}

function setBotStatus(status) {
  BOT_ENABLED = Boolean(status);
}

function getBotStatus() {
  return { enabled: BOT_ENABLED };
}

module.exports = { isBotEnabled, setBotStatus, getBotStatus };
