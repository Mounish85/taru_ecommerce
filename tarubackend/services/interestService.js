const crypto = require("crypto");

const {
  appendRow,
  findRow,
  findRows,
} = require("./googleSheetsService");

const {
  createInterest,
  validateInterest,
} = require("../models/Interest");

function generateId() {
  return `INT_${crypto.randomUUID()}`;
}

async function addInterest(buyerId, productId) {
  const existing = await findRows(
    "Interests",
    "buyerId",
    buyerId
  );

  const alreadyExists = existing.some(
    (interest) =>
      interest.productId === productId
  );

  if (alreadyExists) {
    return existing.find(
      (interest) =>
        interest.productId === productId
    );
  }

  const interest = createInterest({
    interestId: generateId(),
    buyerId,
    productId,
  });

  validateInterest(interest);

  await appendRow("Interests", interest);

  return interest;
}

async function getBuyerInterests(buyerId) {
  return findRows(
    "Interests",
    "buyerId",
    buyerId
  );
}

module.exports = {
  addInterest,
  getBuyerInterests,
};