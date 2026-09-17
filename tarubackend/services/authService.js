const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const {
  appendRow,
  findRow,
} = require("./googleSheetsService");

const {
  createUser,
  validateUser,
} = require("../models/User");

const {
  createSellerProfile,
} = require("../models/SellerProfile");

const {
  appendRow: appendSheetRow,
} = require("./googleSheetsService");

function generateId(prefix) {
  return `${prefix}_${crypto.randomUUID()}`;
}

async function registerUser(data) {
  const existingUser = await findRow(
    "Users",
    "email",
    data.email
  );

  if (existingUser) {
    throw new Error("Email is already registered.");
  }

  const passwordHash = await bcrypt.hash(
    data.password,
    10
  );

  const user = createUser({
    userId: generateId("USR"),
    name: data.name,
    email: data.email,
    passwordHash,
    role: data.role,
  });

  validateUser(user);

  await appendRow("Users", user);

  if (user.role === "SELLER") {
    if (!data.organizationName) {
      throw new Error(
        "organizationName is required for sellers."
      );
    }

    const sellerProfile = createSellerProfile({
      sellerId: generateId("SEL"),
      userId: user.userId,
      organizationName: data.organizationName,
      description: data.description,
      contactInfo: data.contactInfo,
    });

    await appendSheetRow(
      "SellerProfiles",
      sellerProfile
    );
  }

  return {
    userId: user.userId,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

async function loginUser(email, password) {
  const user = await findRow(
    "Users",
    "email",
    email
  );

  if (!user) {
    throw new Error("Invalid email or password.");
  }

  const validPassword = await bcrypt.compare(
    password,
    user.passwordHash
  );

  if (!validPassword) {
    throw new Error("Invalid email or password.");
  }

  const token = jwt.sign(
    {
      userId: user.userId,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  return {
    token,
    user: {
      userId: user.userId,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}

function verifyToken(token) {
  return jwt.verify(
    token,
    process.env.JWT_SECRET
  );
}

module.exports = {
  registerUser,
  loginUser,
  verifyToken,
};