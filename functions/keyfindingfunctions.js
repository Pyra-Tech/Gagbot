const { getFindableCollarKeys, findCollarKey } = require("./collarfunctions");
const { getFindableChastityKeys, findChastityKey, getChastity, getArousal, calcFrustration } = require("./vibefunctions");
const { their } = require("./pronounfunctions");
const { getMitten } = require("./gagfunctions");

// return of 0 = never, 1+ = always
function getFumbleChance(user) {
  let chance = getArousal(user);
  const chastity = getChastity(user);
  if (chastity) {
    const hoursBelted = Date.now() - chastity.timestamp / (60 * 60 * 1000);
    chance += calcFrustration(hoursBelted);
  }

  // chance is increased if the user is wearing mittens
  if (getMitten(user)) {
    chance += 10;
    chance *= 1.1;
  }

  return chance / 100;
}

async function handleKeyFinding(message) {
  const findableChastityKeys = getFindableChastityKeys(message.author.id);
  for ([lockedUser, chance] of findableChastityKeys) {
    if (Math.random() < chance) {
      sendFindMessage(message, lockedUser, "chastity belt");
      findChastityKey(lockedUser, message.author.id);
    }
  }

  const findableCollarKeys = getFindableCollarKeys(message.author.id);
  for ([lockedUser, chance] of findableCollarKeys) {
    if (Math.random() < chance) {
      sendFindMessage(message, lockedUser, "collar");
      findCollarKey(lockedUser, message.author.id);
    }
  }
}

async function sendFindMessage(message, lockedUser, restraint) {
  if (message.author.id == lockedUser) {
    message.channel.send(
      `${message.author} has found the key to ${their(
        message.author.id
      )} ${restraint}!`
    );
  } else {
    message.channel.send(
      `${message.author} has found the key to <@${lockedUser}>'s ${restraint}!`
    );
  }
}

exports.getFumbleChance = getFumbleChance;
exports.handleKeyFinding = handleKeyFinding;
