const puppeteer = require("puppeteer-core");

// Initiate the browser
const openBrowser = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath:
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  });

  return browser;
};

module.exports = openBrowser;
