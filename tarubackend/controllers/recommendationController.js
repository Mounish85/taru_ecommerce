const {
  getRecommendations,
} = require("../services/recommendationService");

async function getMyRecommendations(
  req,
  res
) {
  try {
    const recommendations =
      await getRecommendations(
        req.user.userId
      );

    res.status(200).json({
      success: true,
      count: recommendations.length,
      recommendations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

module.exports = {
  getMyRecommendations,
};