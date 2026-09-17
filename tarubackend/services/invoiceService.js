const PDFDocument = require("pdfkit");

const {
  getOrderById,
} = require("./orderService");

const {
  findRow,
} = require("./googleSheetsService");

const {
  ensureTaruFolders,
  uploadFile,
} = require("./googleDriveService");

function createInvoicePDF({
  order,
  items,
  payment,
  delivery,
}) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      margin: 50,
    });

    const chunks = [];

    doc.on("data", (chunk) => {
      chunks.push(chunk);
    });

    doc.on("end", () => {
      resolve(Buffer.concat(chunks));
    });

    doc.on("error", reject);

    doc
      .fontSize(22)
      .text("Taru Foundation", {
        align: "center",
      });

    doc.moveDown();

    doc
      .fontSize(16)
      .text("Purchase Invoice", {
        align: "center",
      });

    doc.moveDown(2);

    doc.fontSize(11);

    doc.text(`Order ID: ${order.orderId}`);
    doc.text(`Buyer ID: ${order.buyerId}`);
    doc.text(`Date: ${order.createdAt}`);

    doc.moveDown();

    doc.text(
      `Shipping Address: ${order.shippingAddress}`
    );

    doc.moveDown();

    doc.text("Order Items");
    doc.moveDown();

    items.forEach((item, index) => {
      const subtotal =
        Number(item.quantity) *
        Number(item.unitPrice);

      doc.text(
        `${index + 1}. Product: ${
          item.productId
        } | Qty: ${
          item.quantity
        } | Unit Price: ₹${
          item.unitPrice
        } | Subtotal: ₹${subtotal}`
      );
    });

    doc.moveDown();

    doc
      .fontSize(13)
      .text(
        `Total Amount: ₹${order.totalAmount}`
      );

    doc.moveDown();

    if (payment) {
      doc
        .fontSize(11)
        .text(
          `Payment Status: ${payment.status}`
        );

      if (payment.transactionId) {
        doc.text(
          `Transaction ID: ${payment.transactionId}`
        );
      }
    }

    doc.moveDown();

    if (delivery) {
      doc.text(
        `Delivery Status: ${delivery.status}`
      );

      if (delivery.trackingId) {
        doc.text(
          `Tracking ID: ${delivery.trackingId}`
        );
      }
    }

    doc.moveDown(3);

    doc
      .fontSize(10)
      .text(
        "Thank you for supporting rural SHG sellers through Taru Foundation.",
        {
          align: "center",
        }
      );

    doc.end();
  });
}

async function generateInvoice(orderId) {
  const { order, items } =
    await getOrderById(orderId);

  const payment = await findRow(
    "Payments",
    "orderId",
    orderId
  );

  const delivery = await findRow(
    "Deliveries",
    "orderId",
    orderId
  );

  const pdfBuffer = await createInvoicePDF({
    order,
    items,
    payment,
    delivery,
  });

  const folders =
    await ensureTaruFolders();

  const file = await uploadFile({
    fileName: `Invoice_${orderId}.pdf`,
    mimeType: "application/pdf",
    fileBuffer: pdfBuffer,
    folderId: folders.invoices.id,
  });

  return {
    orderId,
    fileId: file.id,
    fileName: file.name,
    webViewLink: file.webViewLink || "",
  };
}

module.exports = {
  generateInvoice,
};