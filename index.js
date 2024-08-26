const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
var cors = require("cors");

const { register, login } = require("./routes/auth");

dotenv.config();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
// parse application/json
app.use(bodyParser.json());
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("connected to database");
  })
  .catch((err) => console.error("Connection error:", err));

router.post("/register", register);
router.post("/login", login)

app.use("/auth", router);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`server is running at port: ${PORT}`);
});
