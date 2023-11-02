const express = require("express");
const ig = require("./ig.controller");

const router = express.Router();

router.use("/ig", ig);

module.exports = { router };
