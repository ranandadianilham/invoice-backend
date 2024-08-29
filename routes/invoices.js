const Invoice = require("../model/Invoice");

exports.CreateInvoice = async (req, res) => {
  const {
    name,
    address,
    remarks,
    invoiceDiscountAmount,
    price,
    quantity,
    amount,
    gstAmount,
  } = req.body;

  try {
    await Invoice.create({
      invoiceNumber: require("crypto").randomUUID(),
      invoiceDate: new Date(),
      clientName: name,
      clientAddress: address,
      remarks: remarks,
      invoiceDiscountAmount: invoiceDiscountAmount,
      invoiceSubtotal: price * quantity * amount,
      gstAmount: gstAmount,
      invoiceGrandTotal: gstAmount + price * quantity,
    })
      .then((result) => {
        res.status(201).json({
          message: "Invoice successfully created",
        });
      })
      .catch((err) => {
        res.status(400).json({
          message: "Invoice not successful created 1",
          error: err.message,
        });
      });
  } catch (err) {
    res.status(400).json({
      message: "Invoice not successful created 2",
      error: err.message,
    });
  }
};
exports.EditInvoice = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    address,
    remarks,
    invoiceDiscountAmount,
    price,
    quantity,
    amount,
    gstAmount,
  } = req.body;

  try {
    await Invoice.updateOne(
      {
        invoiceNumber: require("crypto").randomUUID(),
        invoiceDate: new Date(),
        clientName: name,
        clientAddress: address,
        remarks: remarks,
        invoiceDiscountAmount: invoiceDiscountAmount,
        invoiceSubtotal: price * quantity * amount,
        gstAmount: gstAmount,
        invoiceGrandTotal: gstAmount + price * quantity,
      },
      { where: { _id: id } }
    )
      .then((result) => {
        res.status(201).json({
          message: "Invoice successfully created",
        });
      })
      .catch((err) => {
        res.status(400).json({
          message: "Invoice not successful created 1",
          error: err.message,
        });
      });
  } catch (err) {
    res.status(400).json({
      message: "Invoice not successful created 2",
      error: err.message,
    });
  }
};
exports.GetInvoiceById = async (req, res, next) => {
  const { id } = req.params;

  await Invoice.findById(id)
    .then((result) => {
      res.status(201).json({
        message: "Fetch success",
        data: result,
      });
    })
    .catch((err) => {
      res.status(400).json({
        message: "Fetch Invoice failed",
        error: err.message,
      });
    });

  // res.send(foundInvoice);
};

exports.GetInvoices = async (req, res) => {
  const { id } = req.params;

  await Invoice.find()
    .then((result) => {
      res.status(201).json({
        message: "Fetch success",
        data: result,
      });
    })
    .catch((err) => {
      res.status(400).json({
        message: "Fetch Invoices failed",
        error: err.message,
      });
    });
};

exports.DeleteInvoiceById = (req, res) => {
  const { id } = req.params;
  Invoice.findByIdAndDelete(id)
    .then((deletedUser) => {
      if (deletedUser) {
        res.status(201).json({
          message: `Delete ${id} success`,
          data: deletedUser,
        });
      } else {
        res.status(400).json({
          message: "Delete Invoices failed",
          error: err.message,
        });
      }
    })
    .catch((err) => {
      res.status(400).json({
        message: "Delete Invoices failed",
        error: err.message,
      });
    });
};
