//packages
const express = require("express");

//models
const userModel = require("./usermodel");

//express start
const app = express();

// / route defined

// Define routes AFTER connection
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/create", async (req, res) => {
  try {
    let createdUser = await userModel.create({
      name: "Tanisha Ghosh",
      username: "Tanie",
      email: "tanieghoshtest@gmail.com",
    });
    res.json(createdUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/update", async (req, res) => {
  try {
    let updatedUser = await userModel.findOneAndUpdate(
      { username: "Shibaji" },
      { username: "shibaji" },
      { new: true },
    );
    res.send(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/read", async (req, res) => {
  try {
    let users = await userModel.find();
    res.send(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/delete", async (req, res) => {
  try {
    let user = await userModel.findOneAndDelete({ username: "shibaji" });
    res.send(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server ONLY after connection
app.listen(3000, () => {
  console.log("Server Running on port 3000");
});
