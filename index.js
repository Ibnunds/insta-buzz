const ACC_LIST = require("./data/akun.json");
const POST_LIST = require("./data/post.json");
const Comment = require("./bot/instaComment");
const createInstaPost = require("./bot/instaPost");
const { pickRandomElement } = require("./bin/utils");

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
  const POST = pickRandomElement(POST_LIST);
  console.log(POST);
  await createInstaPost(ACC_LIST[0], POST);
};

//runCommentBot();
runPostBot();
