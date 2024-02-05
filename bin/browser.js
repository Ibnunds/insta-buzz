const puppeteer = require("puppeteer-extra");

// Add stealth plugin and use defaults
const pluginStealth = require("puppeteer-extra-plugin-stealth");
const { executablePath } = require("puppeteer");

// Use stealth
puppeteer.use(pluginStealth());

// Initiate the browser
const openBrowser = async () => {
  const browser = await puppeteer.launch({
    args: [
      "--lang=en-US,en",
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--aggressive-cache-discard",
      "--disable-cache",
      "--disable-application-cache",
      "--disable-offline-load-stale-cache",
      "--disable-gpu-shader-disk-cache",
      "--media-cache-size=0",
      "--disk-cache-size=0",
    ],
    headless: /*"new"*/ false,
    executablePath: executablePath(),
  });

  return browser;
};

module.exports = openBrowser;
