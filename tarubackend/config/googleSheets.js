const { google } = require("googleapis");
const path = require("path");

const serviceAccountPath = path.join(
  __dirname,
  "..",
  "credentials",
  "service-account.json"
);

const auth = new google.auth.GoogleAuth({
  keyFile: serviceAccountPath,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({
  version: "v4",
  auth,
});

module.exports = sheets;