const fs = require("fs");
const PDFDocument = require("pdfkit");

const createInvoice = (invoice, path) => {
  let doc = new PDFDocument({ margin: 50 });

  doc
    .image(__dirname+"/../public/assets/logo.png", 50, 45, { width: 50 })
    .fillColor("#444444")
    .fontSize(20)
    .text("Internshala Inc.", 110, 57)
    .fontSize(10)
    .text("123 Main Street", 200, 65, { align: "right" })
    .text("Berhampore, MSD, 742101", 200, 80, { align: "right" })
    .moveDown();

  doc
    .text(`Invoice Number: ${invoice.invoiceNum}`, 50, 200)
    .text(`Invoice Date: ${new Date().toLocaleDateString()}`, 50, 215)
    .text(`Balance Paid: ${invoice.paid}`, 50, 230)

    .text(invoice.name, 300, 200)
    .text(invoice.email, 300, 215)
    .moveDown();

  doc.end();
  doc.pipe(fs.createWriteStream(path));
};

module.exports = {
  createInvoice,
};
