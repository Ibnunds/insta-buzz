const puppeteer = require("puppeteer");

// Initiate the browser
const openBrowser = async () => {
  const browser = await puppeteer.launch({
    args: ["--lang=en-US,en", "--no-sandbox", "--disable-setuid-sandbox"],
    headless: "new",
  });

  return browser;
};

module.exports = openBrowser;
