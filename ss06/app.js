const express = require("express");
const app = express();
const port = 3000;
const morgan = require("morgan");
const fs = require("fs");
const { validateBody, findUser } = require("./middlewares/users.middleware");

const bodyParser = require("body-parser");

//form html (action,method)
app.use(bodyParser.urlencoded({ extended: true }));
//fetch API
app.use(bodyParser.json());
app.use(express.static("public"));

//define endpoint +http request

app.get("/api", (req, res) => {
  res.json({
    message: "hello world",
  });
});

//get all
app.get("/api/v1/users", (req, res) => {
  try {
    let users = JSON.parse(fs.readFileSync("./data/users.json"));
    console.log(users);
    res.json({ users });
  } catch (error) {
    res.json({ error, status: "fail", message: "invalid path" });
  }
});

//get one
app.get("/api/v1/users/:id", (req, res) => {
  let { id } = req.params;
  try {
    let users = JSON.parse(fs.readFileSync("./data/users.json"));
    let user = users.find((user) => user.id === +id);
    user ? res.json({ user }) : res.json({ message: "not found" });
  } catch (error) {
    res.json({ error, status: "fail", message: "invalid path" });
  }
});

//post
app.post("/api/v1/users", validateBody, (req, res) => {
  const { email, password } = req.body;

  let user = {
    id: Math.floor(Math.random() * 100),
    email,
    password,
  };

  try {
    let users = JSON.parse(fs.readFileSync("./data/users.json"));
    users.push(user);
    fs.writeFileSync("./data/users.json", JSON.stringify(users));
    res.json({ user });
  } catch (error) {
    res.json({ error, status: "fail", message: "invalid path" });
  }
});

//put
app.put("/api/v1/users/:id", [findUser, validateBody], (req, res) => {
  const { id } = req.params;
  const { email, password } = req.body;
  console.log(req.body);

  try {
    let users = JSON.parse(fs.readFileSync("./data/users.json"));
    let user = users.find((user) => user.id === +id);
    console.log(user);
    let updateUser = { ...user, email, password };

    const newUsers = users.map((user) => (user.id === +id ? updateUser : user));
    fs.writeFileSync("./data/users.json", JSON.stringify(newUsers));
    console.log(newUsers);
    res.json({
      message: "Update user success",
      status: "success",
      users: newUsers,
    });
  } catch (error) {
    res.json({ error, status: "fail", message: "invalid path" });
  }
});

//delete
app.delete("/api/v1/users/:id", (req, res) => {
  const { id } = req.params;

  try {
    let users = JSON.parse(fs.readFileSync("./data/users.json"));
    let newUsers = users.filter((user) => user.id !== +id);
    fs.writeFileSync("./data/users.json", JSON.stringify(newUsers));
    console.log(newUsers);
    res.json({
      message: "Delete user success",
      status: "success",
      users: newUsers,
    });
  } catch (error) {
    console.log(error);
  }
});

app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/public/home.html`);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
