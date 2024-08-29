const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
var cors = require("cors");
const cookieParser = require("cookie-parser");

const { register, login, userAuth, login1, register1, authenticateToken } = require("./routes/auth");
const { GetInvoiceById, CreateInvoice, GetInvoices, DeleteInvoiceById, EditInvoice } = require("./routes/invoices");

dotenv.config();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(cookieParser());
// parse application/json
app.use(bodyParser.json());
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("connected to database");
  })
  .catch((err) => console.error("Connection error:", err));

router.post("/register", register1);
router.post("/login", login1);

app.use("/auth", router);

/* crud */
app.get("/invoice/:id", GetInvoiceById)
app.post("/invoice/create", CreateInvoice)
app.post("/invoice/edit/:id", EditInvoice)
app.get("/invoice", GetInvoices)
app.get("/invoice/delete/:id", DeleteInvoiceById)
app.get("/protected", authenticateToken, (req, res) => {
  res.send("this is protected")
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`server is running at port: ${PORT}`);
});
