const {
  createNewProduct,
  getAllProducts,
  getProductById,
  getSellerProducts,
  updateProduct,
  deactivateProduct,
} = require("../services/productService");

const {
  ensureTaruFolders,
  uploadFile,
} = require("../services/googleDriveService");

async function createProduct(req, res) {
  try {
    const {
      name,
      description,
      price,
      quantity,
      category,
      productType,
    } = req.body;

    if (
      !name ||
      price === undefined ||
      quantity === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "name, price and quantity are required.",
      });
    }

    let imageUrl = "";

    if (req.file) {
      const folders =
        await ensureTaruFolders();

      const uploadedFile =
        await uploadFile({
          fileName: req.file.originalname,
          mimeType: req.file.mimetype,
          fileBuffer: req.file.buffer,
          folderId:
            folders.productImages.id,
        });

      imageUrl =
        uploadedFile.webViewLink ||
        uploadedFile.id;
    }

    const product =
      await createNewProduct({
        sellerId: req.user.userId,
        name,
        description,
        price,
        quantity,
        category,
        productType,
        imageUrl,
      });

    res.status(201).json({
      success: true,
      message: "Product created successfully.",
      product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

async function getProducts(req, res) {
  try {
    const products =
      await getAllProducts();

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

async function getProduct(req, res) {
  try {
    const product =
      await getProductById(
        req.params.productId
      );

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
}

async function getMyProducts(req, res) {
  try {
    const products =
      await getSellerProducts(
        req.user.userId
      );

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

async function updateProductController(
  req,
  res
) {
  try {
    const product =
      await updateProduct(
        req.params.productId,
        req.user.userId,
        req.body
      );

    res.status(200).json({
      success: true,
      message: "Product updated successfully.",
      product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

async function deleteProduct(req, res) {
  try {
    const product =
      await deactivateProduct(
        req.params.productId,
        req.user.userId
      );

    res.status(200).json({
      success: true,
      message: "Product deactivated successfully.",
      product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  getMyProducts,
  updateProductController,
  deleteProduct,
};