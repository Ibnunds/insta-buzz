const ProgressBar = require("../bin/bar");
const openBrowser = require("../bin/browser");

function delay(timeout) {
  return new Promise((resolve) => setTimeout(resolve, timeout));
}

const Bar = new ProgressBar();

async function createInstaPost(acc, post) {
  Bar.init(100);
  // acc
  const { id, pw } = acc;

  // post
  const { image, caption } = post;
  const path = "./data/post/";

  const imagePath = path + image;

  // puppeteer
  const browser = await openBrowser();

  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.104 Safari/537.36"
  );

  await page.setExtraHTTPHeaders({
    "Accept-Language": "en",
  });

  try {
    // Go to the target website
    await page.goto("https://www.instagram.com/");

    await page.setViewport({ width: 1920, height: 969 });

    Bar.update(10);

    await page.waitForSelector("#loginForm");

    await page.type('input[name="username"]', id);

    await page.type('input[name="password"]', pw);

    await page.click('button[type="submit"]');

    await page.waitForNavigation();

    Bar.update(20);

    await page.waitForSelector('svg[aria-label="New post"]');

    await page.click('svg[aria-label="New post"]');

    await page.waitForSelector('div[role="dialog"]');

    Bar.update(30);

    // Wait until everything is loaded
    await page.waitForSelector("input[type='file']");

    // Set the value for the correct file input (last on the page is new post)
    let fileInputs = await page.$$('input[type="file"]');
    let input = fileInputs[fileInputs.length - 1];

    await input.uploadFile(imagePath);

    await delay(1500);

    Bar.update(40);

    // Wait for the next button
    await page.waitForXPath("//div[contains(text(),'Next')]");

    // Get the next button
    let next = await page.$x("//div[contains(text(),'Next')]");
    await next[0].click();

    Bar.update(50);

    // Wait for the next button
    await page.waitForXPath("//div[contains(text(),'Next')]");

    // Get the next button
    let nextt = await page.$x("//div[contains(text(),'Next')]");
    await nextt[0].click();

    Bar.update(60);

    await page.waitForSelector('div[aria-label="Write a caption..."]');

    await page.click('div[aria-label="Write a caption..."]');

    // Type
    await page.keyboard.type(caption, { delay: 50 });

    Bar.update(70);

    // Get the share button and click it
    await page.waitForXPath("//div[contains(text(),'Share')]");
    let share = await page.$x("//div[contains(text(),'Share')]");

    await share[0].click();

    await delay(2000);

    Bar.update(80);

    await page.waitForXPath(
      "//span[contains(text(),'Your post has been shared.')]"
    );

    await page.click('svg[aria-label="Close"]');

    await page.waitForXPath("//img[contains(@alt,'profile picture')]");

    let profile = await page.$x("//img[contains(@alt,'profile picture')]");

    await profile[0].click();

    await delay(1000);

    Bar.update(90);

    await page.waitForSelector("div._aabd._aa8k._al3l");

    const postLink = await page.evaluate(async () => {
      const list = document.querySelectorAll("div._aabd._aa8k._al3l");

      const link = list[0].querySelector("a").getAttribute("href");

      return link;
    });

    //await page.goto("https://www.instagram.com" + postLink);

    // console.log(
    //   `${id} success created post ` + "https://www.instagram.com" + postLink
    // );

    Bar.update(100);

    await browser.close();

    return {
      status: "OK",
      postUrl: "https://www.instagram.com" + postLink,
      acc: id,
    };
  } catch (error) {
    await browser.close();
    console.log(error);
    return {
      status: "ERROR",
      postUrl: error,
      acc: id,
    };
  }
}

module.exports = createInstaPost;
