const openBrowser = require("../bin/browser");
const userAgent = require("user-agents");

function delay(timeout) {
  return new Promise((resolve) => setTimeout(resolve, timeout));
}

async function createInstaPost(acc) {
  // acc
  const { id, pw } = acc;

  // puppeteer
  const browser = await openBrowser();

  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.104 Safari/537.36"
  );

  try {
    // Go to the target website
    await page.goto("https://www.instagram.com/");

    await page.waitForSelector("#loginForm");

    await page.type('input[name="username"]', id);

    await page.type('input[name="password"]', pw);

    await page.click('button[type="submit"]');

    await page.waitForNavigation();

    await page.waitForSelector('svg[aria-label="New post"]');

    await page.click('svg[aria-label="New post"]');

    await page.waitForSelector('div[role="dialog"]');

    // Wait until everything is loaded
    await page.waitForSelector("input[type='file']");

    // Set the value for the correct file input (last on the page is new post)
    let fileInputs = await page.$$('input[type="file"]');
    let input = fileInputs[fileInputs.length - 1];

    await input.uploadFile("./data/post/0.jpeg");

    await delay(1500);

    console.debug("waiting for next");

    // Wait for the next button
    await page.waitForXPath("//div[contains(text(),'Next')]");

    console.debug("clicking next");

    // Get the next button
    let next = await page.$x("//div[contains(text(),'Next')]");
    await next[0].click();

    // Wait for the next button
    await page.waitForXPath("//div[contains(text(),'Next')]");

    console.debug("clicking next");

    // Get the next button
    let nextt = await page.$x("//div[contains(text(),'Next')]");
    await nextt[0].click();

    await page.waitForSelector('div[aria-label="Write a caption..."]');

    await page.click('div[aria-label="Write a caption..."]');

    // Type
    await page.keyboard.type("Ini caption saya", { delay: 50 });

    // Get the share button and click it
    await page.waitForXPath("//div[contains(text(),'Share')]");
    let share = await page.$x("//div[contains(text(),'Share')]");

    console.debug("clicking share");

    await share[0].click();

    console.debug("finishing up");

    await delay(2000);

    await page.waitForXPath(
      "//span[contains(text(),'Your post has been shared.')]"
    );

    await page.click('svg[aria-label="Close"]');

    await page.waitForXPath("//img[contains(@alt,'profile picture')]");

    let profile = await page.$x("//img[contains(@alt,'profile picture')]");

    console.debug("clicking share");

    await profile[0].click();

    await delay(1000);

    await page.waitForSelector("div._aabd._aa8k._al3l");

    const postLink = await page.evaluate(async () => {
      const list = document.querySelectorAll("div._aabd._aa8k._al3l");

      const link = list[0].querySelector("a").getAttribute("href");

      return link;
    });

    await page.goto("https://www.instagram.com" + postLink);

    console.log(postLink);
  } catch (error) {
    await browser.close();
    console.log(error);
  }
}

module.exports = createInstaPost;
