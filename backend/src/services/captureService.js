import { getBrowser } from "../worker/browser.js";
import { assertSafePublicUrl } from "../utils/urlSafety.js";

export async function captureTarget(url) {

  const safeUrl = await assertSafePublicUrl(url);
  const browser = await getBrowser();

  const context = await browser.newContext({ //kancelarija u browseru
    viewport: {
      width: 1440,
      height: 1000,
    },
  });

  const page = await context.newPage();  //prozor u pretrazivacu

   await page.route("**/*", async (route) => {
    const request = route.request();

    if (request.resourceType() === "document") {
      try {
        await assertSafePublicUrl(request.url());
      } catch (error) {
        console.error(
          "Blokirana navigacija:",
          error.message
        );

        return route.abort("blockedbyclient");
      }
    }

    return route.continue();
  });

  try {
    const response = await page.goto(
     
      safeUrl.toString(),
       {
      waitUntil: "domcontentloaded",//kada je osnovna html struktura ucitana
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

    const textContent = await page.locator("body").innerText(); //trazi lokaciju stranicu gde je body, samo u tom dely stranice gde je bodu 

    return {
      finalUrl: page.url(),
      textContent: textContent  //koristi se u sledecem service za poredjenje 
        .replace(/\s+/g, " ") //zamjeni vise razmaka sa jednim razmakom, trazi prazne znakove /\s tabovi ili  prazni prostori a +/g svud gde se nalazi u textu 
        .trim(),
        // screenshotBuffer -> treba da vrati jer ne zna kako je stranica izgledala pre -> je slika sajta koji se koristi u seldecem servisu za poredjenje
    };
  } finally {
    await context.close();
  }
}