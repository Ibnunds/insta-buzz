const openBrowser = require("../bin/browser");
const { pickRandomElement } = require("../bin/utils");

async function Comment(acc, target) {
  // handle acc
  const { id, pw } = acc;
  const COMMENT_LIST = require("../data/komentar.json");
  const cword = pickRandomElement(COMMENT_LIST);

  // browser
  const browser = await openBrowser();

  const page = await browser.newPage();

  try {
    // Go to the target website
    await page.goto("https://www.instagram.com/");

    await page.waitForSelector("#loginForm");

    await page.type('input[name="username"]', id);

    await page.type('input[name="password"]', pw);

    await page.click('button[type="submit"]');

    await page.waitForNavigation();

    await page.goto(target);

    await page.waitForSelector('textarea[placeholder="Add a comment…"]');

    await page.click('textarea[placeholder="Add a comment…"]');

    await page.type('textarea[placeholder="Add a comment…"]', cword);

    await page.waitForTimeout(2000);

    await page.keyboard.press("Enter");

    await browser.close();

    return {
      status: "OK",
      message: `${id} comment success on target ${target}`,
    };
  } catch (error) {
    await browser.close();
    return {
      status: "ERROR",
      message: `${id} comment failed on target ${target}, Reason :  ${error}`,
    };
  }
}

module.exports = Comment;
