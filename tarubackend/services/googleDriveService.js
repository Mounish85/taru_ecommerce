const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");
const { Readable } = require("stream");

const credentialsPath = path.join(
  __dirname,
  "..",
  "credentials",
  "oauth-client.json"
);

const tokenPath = path.join(
  __dirname,
  "..",
  "credentials",
  "drive-token.json"
);

const SCOPES = [
  "https://www.googleapis.com/auth/drive.file",
];

let oauth2Client = null;

function getOAuthClient() {
  if (oauth2Client) {
    return oauth2Client;
  }

  const credentials = JSON.parse(
    fs.readFileSync(credentialsPath, "utf8")
  );

  const config = credentials.web || credentials.installed;

  oauth2Client = new google.auth.OAuth2(
    config.client_id,
    config.client_secret,
    process.env.GOOGLE_OAUTH_REDIRECT_URI
  );

  return oauth2Client;
}

function getAuthorizationUrl() {
  const client = getOAuthClient();

  return client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent",
  });
}

async function handleOAuthCallback(code) {
  const client = getOAuthClient();

  const { tokens } = await client.getToken(code);

  client.setCredentials(tokens);

  fs.writeFileSync(
    tokenPath,
    JSON.stringify(tokens, null, 2)
  );

  return tokens;
}

function loadSavedToken() {
  if (!fs.existsSync(tokenPath)) {
    return false;
  }

  const tokens = JSON.parse(
    fs.readFileSync(tokenPath, "utf8")
  );

  getOAuthClient().setCredentials(tokens);

  return true;
}

function getDriveClient() {
  const client = getOAuthClient();

  if (!client.credentials?.refresh_token) {
    loadSavedToken();
  }

  if (!client.credentials?.refresh_token) {
    throw new Error(
      "Google Drive is not authorized. Visit /taru/google/auth first."
    );
  }

  return google.drive({
    version: "v3",
    auth: client,
  });
}

async function createFolder(name, parentId = null) {
  const drive = getDriveClient();

  const metadata = {
    name,
    mimeType: "application/vnd.google-apps.folder",
  };

  if (parentId) {
    metadata.parents = [parentId];
  }

  const response = await drive.files.create({
    requestBody: metadata,
    fields: "id,name",
  });

  return response.data;
}

async function ensureFolder(name, parentId = null) {
  const drive = getDriveClient();

  let query =
    `name = '${name.replace(/'/g, "\\'")}'` +
    " and mimeType = 'application/vnd.google-apps.folder'" +
    " and trashed = false";

  if (parentId) {
    query += ` and '${parentId}' in parents`;
  }

  const response = await drive.files.list({
    q: query,
    fields: "files(id,name)",
    spaces: "drive",
  });

  if (response.data.files?.length > 0) {
    return response.data.files[0];
  }

  return createFolder(name, parentId);
}

async function ensureTaruFolders() {
  const root = await ensureFolder("TaruFoundation");

  const productImages = await ensureFolder(
    "ProductImages",
    root.id
  );

  const documents = await ensureFolder(
    "Documents",
    root.id
  );

  const invoices = await ensureFolder(
    "Invoices",
    root.id
  );

  return {
    root,
    productImages,
    documents,
    invoices,
  };
}

async function uploadFile({
  fileName,
  mimeType,
  fileBuffer,
  folderId,
}) {
  const drive = getDriveClient();

  const response = await drive.files.create({
    requestBody: {
      name: fileName,
      parents: folderId ? [folderId] : undefined,
    },

    media: {
      mimeType,
      body: Readable.from(fileBuffer),
    },

    fields: "id,name,mimeType,webViewLink",
  });

  return response.data;
}

async function deleteFile(fileId) {
  const drive = getDriveClient();

  await drive.files.delete({
    fileId,
  });

  return true;
}

async function getFile(fileId) {
  const drive = getDriveClient();

  const response = await drive.files.get({
    fileId,
    fields: "id,name,mimeType,webViewLink",
  });

  return response.data;
}

module.exports = {
  getAuthorizationUrl,
  handleOAuthCallback,
  loadSavedToken,
  ensureTaruFolders,
  uploadFile,
  deleteFile,
  getFile,
};