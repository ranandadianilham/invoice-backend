const { createSecretToken } = require("../middleware/auth");
const User = require("../model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

exports.register = async (req, res) => {
  const { username, password } = req.body;

  if (password?.length < 6) {
    return res.status(400).json({ message: "Password less than 6 characters" });
  }
  bcrypt.hash(password, 10).then(async (hash) => {
    await User.create({
      username,
      password: hash,
    })
      .then((user) => {
        const maxAge = 3 * 60 * 60;
        const token = jwt.sign(
          { id: user._id, username, role: user.role },
          jwtSecret,
          {
            expiresIn: maxAge, // 3hrs in sec
          }
        );
        res.cookie("jwt", token, {
          httpOnly: true,
          maxAge: maxAge * 1000, // 3hrs in ms
        });
        res.status(201).json({
          message: "User successfully created",
          user: user._id,
        });
      })
      .catch((error) =>
        res.status(400).json({
          message: "User not successful created",
          error: error.message,
        })
      );
  });
};

exports.login = async (req, res, next) => {
  const { username, password } = req.body;
  // Check if username and password is provided
  if (!username || !password) {
    return res.status(400).json({
      message: "Username or Password not present",
    });
  }
  try {
    const user = await User.findOne({ username });
    if (!user) {
      res.status(400).json({
        message: "Login not successful",
        error: "User not found",
      });
    } else {
      // comparing given password with hashed password
      bcrypt.compare(password, user.password).then(function (result) {
        if (result) {
          const maxAge = 3 * 60 * 60;
          const token = jwt.sign(
            { id: user._id, username, role: user.role },
            jwtSecret,
            {
              expiresIn: maxAge, // 3hrs in sec
            }
          );
          res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: maxAge * 1000, // 3hrs in ms
          });
          res.status(201).json({
            message: "User successfully Logged in",
            user: user._id,
          });
        } else {
          res.status(400).json({ message: "Login not succesful" });
        }
      });
    }
  } catch (error) {
    res.status(400).json({
      message: "An error occurred",
      error: error.message,
    });
  }
};

exports.register1 = async (req, res) => {
  const { username, password } = req.body;

  // Check if the user already exists
  const existingUser = User.find({ username });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  try {
    // Hash the user's password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Store the new user
    users.push({ username, password: hashedPassword });
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error registering user" });
  }
};

exports.login1 = async (req, res) => {
  // In a real-world scenario, you would typically validate the user's credentials here
  const { username, password } = req.body;
  //const hashedPass = await bcrypt.hash(password, 10);
  const user = await User.find({ username })
    .then(async (usr) => {
      let valUser = usr[0];
      const isMatch = await bcrypt.compare(password, valUser.password);
      console.log("token", password, valUser, isMatch);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign({ username }, jwtSecret, { expiresIn: "1h" });
      //console.log('token', ( token).toString())
      res.json({ token });
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "Error logging in user", more: err.message });
    });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
};

exports.userAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, jwtSecret, (err, decodedToken) => {
      if (err) {
        return res.status(401).json({ message: "Not authorized" });
      } else {
        next();
      }
    });
  } else {
    return res
      .status(401)
      .json({ message: "Not authorized, token not available" });
  }
};
exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];  // Bearer <token>

  if (token == null) return res.sendStatus(401);  // No token present

  jwt.verify(token, jwtSecret, (err, user) => {
      if (err) return res.sendStatus(403);  // Invalid token

      req.user = user;
      next();
  });
};