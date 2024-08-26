const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

/* userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.getSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
}); */

const User = mongoose.model("user", userSchema)

module.exports = User;
