const express = require("express");
const { router } = require("./controller");

const app = express();
const port = 3000;

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE" // what matters here is that OPTIONS is present
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// router
app.use(router);

app.listen(port, () => {
  console.log(`Server Sedang Berjalan [v.1.0] -> PORT:${port}`);
});
