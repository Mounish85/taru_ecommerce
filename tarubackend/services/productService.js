const crypto = require("crypto");

const {
  appendRow,
  findRow,
  findRows,
  getRows,
  updateRow,
} = require("./googleSheetsService");

const {
  createProduct,
  validateProduct,
} = require("../models/Product");

function generateId() {
  return `PRD_${crypto.randomUUID()}`;
}

async function createNewProduct(data) {
  const product = createProduct({
    productId: generateId(),
    sellerId: data.sellerId,
    name: data.name,
    description: data.description,
    price: data.price,
    quantity: data.quantity,
    category: data.category,
    productType: data.productType,
    imageUrl: data.imageUrl,
    status: "AVAILABLE",
  });

  validateProduct(product);

  await appendRow("Products", product);

  return product;
}

async function getAllProducts() {
  const products = await getRows("Products");

  return products.map(
    ({ _rowNumber, ...product }) => product
  );
}

async function getProductById(productId) {
  const product = await findRow(
    "Products",
    "productId",
    productId
  );

  if (!product) {
    throw new Error("Product not found.");
  }

  return product;
}

async function getSellerProducts(sellerId) {
  return findRows(
    "Products",
    "sellerId",
    sellerId
  );
}

async function updateProduct(productId, sellerId, data) {
  const product = await findRow(
    "Products",
    "productId",
    productId
  );

  if (!product) {
    throw new Error("Product not found.");
  }

  if (product.sellerId !== sellerId) {
    throw new Error(
      "You can only modify your own products."
    );
  }

  const updatedProduct = {
    productId: product.productId,
    sellerId: product.sellerId,
    name:
      data.name !== undefined
        ? data.name
        : product.name,
    description:
      data.description !== undefined
        ? data.description
        : product.description,
    price:
      data.price !== undefined
        ? Number(data.price)
        : Number(product.price),
    quantity:
      data.quantity !== undefined
        ? Number(data.quantity)
        : Number(product.quantity),
    category:
      data.category !== undefined
        ? data.category
        : product.category,
    productType:
      data.productType !== undefined
        ? data.productType
        : product.productType,
    imageUrl:
      data.imageUrl !== undefined
        ? data.imageUrl
        : product.imageUrl,
    status:
      data.status !== undefined
        ? data.status
        : product.status,
    createdAt: product.createdAt,
  };

  validateProduct(updatedProduct);

  await updateRow(
    "Products",
    product._rowNumber,
    updatedProduct
  );

  return updatedProduct;
}

async function deactivateProduct(productId, sellerId) {
  const product = await findRow(
    "Products",
    "productId",
    productId
  );

  if (!product) {
    throw new Error("Product not found.");
  }

  if (product.sellerId !== sellerId) {
    throw new Error(
      "You can only modify your own products."
    );
  }

  product.status = "INACTIVE";

  const { _rowNumber, ...data } = product;

  await updateRow(
    "Products",
    _rowNumber,
    data
  );

  return data;
}

async function reduceProductQuantity(
  productId,
  quantity
) {
  const product = await findRow(
    "Products",
    "productId",
    productId
  );

  if (!product) {
    throw new Error("Product not found.");
  }

  const currentQuantity = Number(product.quantity);
  const requestedQuantity = Number(quantity);

  if (
    product.status !== "AVAILABLE" ||
    currentQuantity < requestedQuantity
  ) {
    throw new Error(
      `Insufficient stock for product: ${product.name}`
    );
  }

  const newQuantity =
    currentQuantity - requestedQuantity;

  product.quantity = newQuantity;

  if (
    product.productType === "UNIQUE" &&
    newQuantity === 0
  ) {
    product.status = "SOLD";
  }

  if (
    product.productType === "REGULAR" &&
    newQuantity === 0
  ) {
    product.status = "SOLD";
  }

  const { _rowNumber, ...data } = product;

  await updateRow(
    "Products",
    _rowNumber,
    data
  );

  return data;
}

module.exports = {
  createNewProduct,
  getAllProducts,
  getProductById,
  getSellerProducts,
  updateProduct,
  deactivateProduct,
  reduceProductQuantity,
};