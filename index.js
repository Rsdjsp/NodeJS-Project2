const express = require("express");
const cors = require("cors");
const cookies = require("cookie-parser");
const { port, env, callback_url } = require("./config");

//Importando routers
const auth = require("./routes/auth");
const teams = require("./routes/teams");
const task = require("./routes/task");
const list = require("./routes/list");
const comments = require("./routes/comments");

const app = express();

app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000"],
  })
);
app.use(cookies());

const { connection } = require("./config/db");

connection();

// Utilizando las rutas
auth(app);
teams(app);
task(app);
list(app);
comments(app);

app.get("/", (req, res) => {
  return res.json({ hello: "world" });
});

app.listen(port, () => {
  console.log("Modo:", env);
  console.log("listening on: http://localhost:" + port);
  console.log(callback_url);
});
