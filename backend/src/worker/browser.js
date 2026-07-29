import { chromium } from "playwright";

let browser;

export async function getBrowser() {
  if (!browser) {
    browser = await chromium.launch({
      headless: true,//nije vidljiv u prozoru , ne otvara se nikakav prozor u serveru
    });
  }

  return browser;
}