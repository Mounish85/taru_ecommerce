const {
  getRows,
} = require("./googleSheetsService");

async function getRecommendations(buyerId) {
  const interests = await getRows("Interests");
  const products = await getRows("Products");

  const buyerInterests = interests.filter(
    (interest) =>
      interest.buyerId === buyerId
  );

  if (buyerInterests.length === 0) {
    return [];
  }

  const interestedProductIds =
    buyerInterests.map(
      (interest) => interest.productId
    );

  const interestedProducts = products.filter(
    (product) =>
      interestedProductIds.includes(
        product.productId
      )
  );

  const categories = [
    ...new Set(
      interestedProducts
        .map((product) => product.category)
        .filter(Boolean)
    ),
  ];

  const recommendations = products.filter(
    (product) =>
      product.status === "AVAILABLE" &&
      categories.includes(product.category) &&
      !interestedProductIds.includes(
        product.productId
      )
  );

  return recommendations;
}

module.exports = {
  getRecommendations,
};