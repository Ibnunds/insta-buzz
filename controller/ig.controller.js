const express = require("express");
const { pickRandomElement } = require("../bin/utils");
const ACC_LIST = require("../data/akun.json");
const POST_LIST = require("../data/post.json");
const createInstaPost = require("../bot/instaPost");
const ResponseHandler = require("../bin/response");
const reportAutoPostIG = require("../bin/reportIGpost");

const ig = express.Router();

ig.get("/post", async (req, res) => {
  let reportTemp = [];

  try {
    for (let i = 0; i < ACC_LIST.length; i++) {
      const S_POST = pickRandomElement(POST_LIST);
      const post = await createInstaPost(ACC_LIST[i], S_POST);

      if (post) {
        reportTemp.push(
          `${post.status} -> [${post.acc} : ${
            post.status == "OK" ? post.postUrl : ""
          }]`
        );
      }
    }
    // write logs report
    reportAutoPostIG(reportTemp);

    res.json(
      ResponseHandler(200, `Auto post IG sukses ${reportTemp.length} akun}`, {
        totalAkun: reportTemp.length,
      })
    );
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json(
        ResponseHandler(400, `Auto post IG gagal`, {
          totalAkun: reportTemp.length,
        })
      );
  }
});

module.exports = ig;
