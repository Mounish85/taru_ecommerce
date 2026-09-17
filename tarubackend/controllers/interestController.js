const {
  addInterest,
  getBuyerInterests,
} = require("../services/interestService");

async function addProductInterest(req, res) {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "productId is required.",
      });
    }

    const interest =
      await addInterest(
        req.user.userId,
        productId
      );

    res.status(201).json({
      success: true,
      message: "Product interest recorded.",
      interest,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

async function getMyInterests(req, res) {
  try {
    const interests =
      await getBuyerInterests(
        req.user.userId
      );

    res.status(200).json({
      success: true,
      count: interests.length,
      interests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

module.exports = {
  addProductInterest,
  getMyInterests,
};