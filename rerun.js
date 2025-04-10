const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

const TIMEOUT_ERROR_MESSAGE = 'Waiting for selector `button[aria-label^="Billede af"] img` failed: Waiting failed: 10000ms exceeded';
const INPUT_ORIGINAL = 'place_pics.json';
const INPUT_DETAILED = 'detailed_places1.json';
const OUTPUT_CLEANED = 'place_pics_cleaned.json';

// Helper to launch a fresh browser
async function launchBrowser() {
  return puppeteer.launch({
    headless: false,
    args: ['--lang=en-US', '--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });
}

// Main retry + scrape function
async function getImageUrl(place, browser) {
  let page;
  try {
    page = await browser.newPage();
    await page.goto(place.url, { waitUntil: 'networkidle2', timeout: 10000 });

    try {
      await page.waitForSelector('button[aria-label="Afvis alle"]', { timeout: 3000 });
      await page.click('button[aria-label="Afvis alle"]');
    } catch {}

    await page.waitForSelector('button[aria-label^="Billede af"] img', { timeout: 10000 });
    const imageUrl = await page.$eval(
      'button[aria-label^="Billede af"] img',
      img => img.src
    );

    await page.close();
    return { place_id: place.place_id, image_url: imageUrl };
  } catch (err) {
    if (page && !page.isClosed()) await page.close();
    return {
      place_id: place.place_id,
      image_url: null,
      error: err.message
    };
  }
}

(async () => {
  const [originalRaw, detailedRaw] = await Promise.all([
    fs.readFile(path.join(__dirname, INPUT_ORIGINAL), 'utf8'),
    fs.readFile(path.join(__dirname, INPUT_DETAILED), 'utf8')
  ]);

  const original = JSON.parse(originalRaw);
  const detailed = JSON.parse(detailedRaw);

  const failed = original.filter(e => e.image_url === null && e.error?.includes(TIMEOUT_ERROR_MESSAGE));
  const detailedMap = new Map(detailed.map(p => [p.place_id, p]));

  console.log(`Retrying ${failed.length} failed places...`);

  let browser = await launchBrowser();
  const retryResults = [];

  for (let i = 0; i < failed.length; i++) {
    const failedEntry = failed[i];
    const detail = detailedMap.get(failedEntry.place_id);
    if (!detail) continue;

    console.log(`(${i + 1}/${failed.length}) Retrying: ${detail.place_id}`);
    let result;

    try {
      result = await getImageUrl(detail, browser);
    } catch (err) {
      console.warn(`Browser or newPage failed, restarting browser...`);
      await browser.close();
      browser = await launchBrowser();
      result = await getImageUrl(detail, browser);
    }

    retryResults.push(result);
  }

  await browser.close();

  // Merge retry results into original
  const retryMap = new Map(retryResults.map(r => [r.place_id, r]));

  const merged = original.map(entry => {
    if (retryMap.has(entry.place_id)) {
      return retryMap.get(entry.place_id);
    }
    return entry;
  });

  // Filter out any remaining with errors or missing image
  const cleaned = merged.filter(entry => entry.image_url && !entry.error);

  // Save to file
  await fs.writeFile(
    path.join(__dirname, OUTPUT_CLEANED),
    JSON.stringify(cleaned, null, 2)
  );

  console.log(`✅ Done. Cleaned ${cleaned.length} entries saved to ${OUTPUT_CLEANED}`);
})();
