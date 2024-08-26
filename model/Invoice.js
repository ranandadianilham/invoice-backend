const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: true,
    unique: true,
  },
  invoiceDate: {
    type: Date,
    required: true,
  },
  clientName: {
    type: String,
    required: true,
  },
  clientAddress: {
    type: String,
    required: true,
  },
  remarks: {
    type: String,
    default: "",
  },
  invoiceDiscountAmount: {
    type: Number,
    default: 0,
  },
  invoiceSubtotal: {
    type: Number,
    required: true,
  },
  gstAmount: {
    type: Number,
    required: true,
  },
  invoiceGrandTotal: {
    type: Number,
    required: true,
  },
});

const Invoice = mongoose.model("invoice", invoiceSchema);

module.exports = Invoice;

/* 
- invoice Number
- invoice Date
- client name
- client address
- remarks
- invoice discount amount
- invoice subtotal,
- GST Amount
- invoice Grand Total
*/
