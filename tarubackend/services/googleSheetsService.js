const sheets = require("../config/googleSheets");

const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;

const SHEETS = {
  Users: [
    "userId",
    "name",
    "email",
    "passwordHash",
    "role",
    "createdAt",
  ],

  SellerProfiles: [
    "sellerId",
    "userId",
    "organizationName",
    "description",
    "contactInfo",
    "createdAt",
  ],

  Products: [
    "productId",
    "sellerId",
    "name",
    "description",
    "price",
    "quantity",
    "category",
    "productType",
    "imageUrl",
    "status",
    "createdAt",
  ],

  Interests: [
    "interestId",
    "buyerId",
    "productId",
    "createdAt",
  ],

  Orders: [
    "orderId",
    "buyerId",
    "totalAmount",
    "status",
    "shippingAddress",
    "createdAt",
  ],

  OrderItems: [
    "orderItemId",
    "orderId",
    "productId",
    "quantity",
    "unitPrice",
  ],

  Payments: [
    "paymentId",
    "orderId",
    "amount",
    "status",
    "transactionId",
    "paidAt",
  ],

  Deliveries: [
    "deliveryId",
    "orderId",
    "address",
    "status",
    "trackingId",
    "updatedAt",
  ],
};

function columnLetter(number) {
  let result = "";

  while (number > 0) {
    const remainder = (number - 1) % 26;
    result = String.fromCharCode(65 + remainder) + result;
    number = Math.floor((number - 1) / 26);
  }

  return result;
}

async function getExistingSheets() {
  const response = await sheets.spreadsheets.get({
    spreadsheetId: SPREADSHEET_ID,
  });

  return response.data.sheets.map(
    (sheet) => sheet.properties.title
  );
}

async function createMissingSheets(existingSheets) {
  const requests = [];

  for (const sheetName of Object.keys(SHEETS)) {
    if (!existingSheets.includes(sheetName)) {
      requests.push({
        addSheet: {
          properties: {
            title: sheetName,
          },
        },
      });
    }
  }

  if (requests.length > 0) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        requests,
      },
    });
  }
}

async function initializeHeaders() {
  for (const [sheetName, headers] of Object.entries(SHEETS)) {
    const endColumn = columnLetter(headers.length);

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A1:${endColumn}1`,
    });

    const existingHeaders = response.data.values?.[0] || [];

    const match =
      existingHeaders.length === headers.length &&
      headers.every(
        (header, index) =>
          existingHeaders[index] === header
      );

    if (!match) {
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${sheetName}!A1:${endColumn}1`,
        valueInputOption: "RAW",
        requestBody: {
          values: [headers],
        },
      });
    }
  }
}

async function initializeDatabase() {
  if (!SPREADSHEET_ID) {
    throw new Error(
      "GOOGLE_SPREADSHEET_ID is missing in .env"
    );
  }

  console.log("Initializing Google Sheets database...");

  const existingSheets = await getExistingSheets();

  await createMissingSheets(existingSheets);

  await initializeHeaders();

  console.log(
    "Google Sheets database initialized successfully."
  );
}

async function appendRow(sheetName, data) {
  const headers = SHEETS[sheetName];

  if (!headers) {
    throw new Error(`Unknown sheet: ${sheetName}`);
  }

  const row = headers.map((header) =>
    data[header] !== undefined &&
    data[header] !== null
      ? data[header]
      : ""
  );

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: `${sheetName}!A:Z`,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [row],
    },
  });
}

async function getRows(sheetName) {
  if (!SHEETS[sheetName]) {
    throw new Error(`Unknown sheet: ${sheetName}`);
  }

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${sheetName}!A:Z`,
  });

  const values = response.data.values || [];

  if (values.length <= 1) {
    return [];
  }

  const headers = values[0];

  return values.slice(1).map((row, index) => {
    const object = {
      _rowNumber: index + 2,
    };

    headers.forEach((header, columnIndex) => {
      object[header] = row[columnIndex] || "";
    });

    return object;
  });
}

async function findRow(sheetName, field, value) {
  const rows = await getRows(sheetName);

  return (
    rows.find(
      (row) => String(row[field]) === String(value)
    ) || null
  );
}

async function findRows(sheetName, field, value) {
  const rows = await getRows(sheetName);

  return rows.filter(
    (row) => String(row[field]) === String(value)
  );
}

async function updateRow(sheetName, rowNumber, data) {
  const headers = SHEETS[sheetName];

  if (!headers) {
    throw new Error(`Unknown sheet: ${sheetName}`);
  }

  const row = headers.map((header) =>
    data[header] !== undefined &&
    data[header] !== null
      ? data[header]
      : ""
  );

  const endColumn = columnLetter(headers.length);

  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `${sheetName}!A${rowNumber}:${endColumn}${rowNumber}`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [row],
    },
  });
}

async function deleteRow(sheetName, rowNumber) {
  const response = await sheets.spreadsheets.get({
    spreadsheetId: SPREADSHEET_ID,
  });

  const sheet = response.data.sheets.find(
    (item) => item.properties.title === sheetName
  );

  if (!sheet) {
    throw new Error(`Unknown sheet: ${sheetName}`);
  }

  const sheetId = sheet.properties.sheetId;

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    requestBody: {
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId,
              dimension: "ROWS",
              startIndex: rowNumber - 1,
              endIndex: rowNumber,
            },
          },
        },
      ],
    },
  });
}

module.exports = {
  SHEETS,
  initializeDatabase,
  appendRow,
  getRows,
  findRow,
  findRows,
  updateRow,
  deleteRow,
};