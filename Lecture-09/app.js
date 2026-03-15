const express = require("express");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 3000;
const saltRounds = 10;
app.use(cookieParser());

app.get("/", (req, res) => {
  bcrypt.genSalt(saltRounds, function (err, salt) {
    const myPlaintextPassword = "rishi1234";
    bcrypt.hash(myPlaintextPassword, salt, function (err, hash) {
      console.log(hash);
    });
  });
  res.send("Hello");
});

app.get("/decrypt", (req, res) => {
  let exampleHash =
    "$2b$10$W1dft44GJzFotcfXiuzwbeVNnwq4oTO6ScYWPq88EgUyzcfdfxwX6";
  const myPlaintextPassword = "rishi1234";
  bcrypt.compare(myPlaintextPassword, exampleHash, (err, result) => {
    res.send(result);
  });
});

app.get("/jwt", (req, res) => {
  let token = jwt.sign(
    { email: "adrishikhartesting@example.com" },
    "secretTextDontReveal",
  );
  res.cookie("token",token)
  console.log(token)
  res.send(token)
});

app.get("/read", (req, res) => {
  let data=jwt.verify(req.cookies.token,"secretTextDontReveal")
  res.send(data);
});

app.listen(PORT, () => {
  console.log(`Server running at ${PORT}`);
});
