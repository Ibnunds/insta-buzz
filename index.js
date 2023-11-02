const ACC_LIST = require("./data/akun.json");
const POST_LIST = require("./data/post.json");
const Comment = require("./bot/instaComment");
const createInstaPost = require("./bot/instaPost");
const { pickRandomElement } = require("./bin/utils");
const express = require("express");

const app = express();
const port = 3000;

const runCommentBot = async () => {
  let result = {
    success: 0,
    failed: 0,
  };
  const TARGET = "https://www.instagram.com/p/CyualCBx98E/";

  for (let i = 0; i < ACC_LIST.length; i++) {
    const comment = await Comment(ACC_LIST[i], TARGET);
    console.log(comment.message);
    if (comment.status == "OK") {
      result.success += 1;
    } else {
      result.failed += 1;
    }
  }

  console.log("Result : " + JSON.stringify(result));
};

const runPostBot = async () => {
  // pick random post
  const POST = pickRandomElement(POST_LIST);

  // create post
  const result = await createInstaPost(ACC_LIST[0], POST);

  return result.postUrl;
};

//runCommentBot();
//runPostBot();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE" // what matters here is that OPTIONS is present
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.get("/post", async (req, res) => {
  try {
    const result = await runPostBot();

    if (result) {
      res.status(200).json({
        status: 200,
        message: "Success",
        data: {
          postUrl: result,
        },
      });

      return;
    } else {
      res.status(400).json({
        status: 400,
        message: "Error",
        data: {
          postUrl: null,
        },
      });

      return;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });

    return;
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
