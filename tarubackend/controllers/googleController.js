const {
  getAuthorizationUrl,
  handleOAuthCallback,
  ensureTaruFolders,
} = require("../services/googleDriveService");

function googleAuth(req, res) {
  try {
    const url = getAuthorizationUrl();

    res.redirect(url);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

async function googleCallback(req, res) {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Authorization code is missing.",
      });
    }

    await handleOAuthCallback(code);

    await ensureTaruFolders();

    res.status(200).send(`
      <h2>Google Drive authorization successful</h2>
      <p>Taru Foundation Drive folders are ready.</p>
      <p>You can close this window.</p>
    `);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message:
        "Google Drive authorization failed.",
      error: error.message,
    });
  }
}

module.exports = {
  googleAuth,
  googleCallback,
};