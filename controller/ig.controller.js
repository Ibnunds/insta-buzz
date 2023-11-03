const express = require("express");
const ACC_LIST = require("../data/akun.json");
const createInstaPost = require("../bot/instaPost");
const ResponseHandler = require("../bin/response");
const IGComment = require("../bot/instaComment");
const reportIG = require("../bin/reportIGpost");

const ig = express.Router();

// Instagram auto post
ig.get("/post", async (req, res) => {
  const { batch } = req.query;
  let reportTemp = [];
  let final = {
    success: 0,
    failed: 0,
  };
  const batchSize = batch ?? 2;

  const totalBatches = Math.ceil(ACC_LIST.length / batchSize);

  try {
    for (let i = 0; i < totalBatches; i++) {
      const start = i * batchSize;
      const end = (i + 1) * batchSize;
      const batch = ACC_LIST.slice(start, end);

      const batchPromises = batch.map(async (item) => {
        try {
          const post = await createInstaPost(item);
          if (post) {
            reportTemp.push(
              `${post.status} -> [${post.acc} : ${post.postUrl}]`
            );

            if (post.status == "OK") {
              final.success += 1;
            } else {
              final.failed += 1;
            }
          }
        } catch (error) {
          final.failed += 1;
          console.error(`Terjadi kesalahan: ${error}`);
        }
      });
      await Promise.all(batchPromises);
    }
    // write logs report
    reportIG(reportTemp, "AutoPostIG");

    res.json(
      ResponseHandler(200, `Auto post IG sukses ${reportTemp.length} akun}`, {
        totalAkun: reportTemp.length,
        sukses: final.success,
        failed: final.failed,
      })
    );
  } catch (error) {
    console.log(error);
    res.status(400).json(
      ResponseHandler(400, `Auto post IG gagal`, {
        totalAkun: reportTemp.length,
        sukses: final.success,
        failed: final.failed,
      })
    );
  }
});

// Instagram auto comment
ig.get("/comment", async (req, res) => {
  const { target, batch } = req.query;
  let reportTemp = [];
  let final = {
    success: 0,
    failed: 0,
  };

  const batchSize = batch ?? 2;

  const totalBatches = Math.ceil(ACC_LIST.length / batchSize);

  try {
    for (let i = 0; i < totalBatches; i++) {
      const start = i * batchSize;
      const end = (i + 1) * batchSize;
      const batch = ACC_LIST.slice(start, end);

      const batchPromises = batch.map(async (item) => {
        try {
          const comment = await IGComment(item, target);
          if (comment) {
            reportTemp.push(
              `${comment.status} -> [${comment.data.acc} : ${comment.data.comment} @ ${comment.data.target}]`
            );

            if (comment.status == "OK") {
              final.success += 1;
            } else {
              final.failed += 1;
            }
          }
        } catch (error) {
          final.failed += 1;
          console.error(`Terjadi kesalahan: ${error}`);
        }
      });
      await Promise.all(batchPromises);
    }

    // write logs report
    reportIG(reportTemp, "AutoCommentIG");

    res.json(
      ResponseHandler(
        200,
        `Auto comment IG sukses ${reportTemp.length} akun}`,
        {
          totalAkun: reportTemp.length,
          sukses: final.success,
          failed: final.failed,
        }
      )
    );
  } catch (error) {
    console.log(error);
    res.status(400).json(
      ResponseHandler(400, `Auto comment IG gagal`, {
        totalAkun: reportTemp.length,
        sukses: final.success,
        failed: final.failed,
      })
    );
  }
});

module.exports = ig;
