import { getBrowser } from "../worker/browser.js";

export async function captureTarget(url) {
  const browser = await getBrowser();

  const context = await browser.newContext({
    viewport: {
      width: 1440,
      height: 1000,
    },
  });

  const page = await context.newPage();

  try {
    const response = await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 30_000,
    });

    if (!response) {
      throw new Error("Stranica nije vratila odgovor.");
    }

    if (response.status() >= 400) {
      throw new Error(
        `Stranica je vratila HTTP ${response.status()}.`
      );
    }

    const textContent = await page.locator("body").innerText();

    return {
      finalUrl: page.url(),
      textContent: textContent
        .replace(/\s+/g, " ")
        .trim(),
    };
  } finally {
    await context.close();
  }
}