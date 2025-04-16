const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

const CONCURRENT_PAGES = 8; // Try 6–10 depending on your machine

async function processPlace(browser, place, index, total) {
  const url = place.url;
  const placeId = place.place_id;

  const page = await browser.newPage();
  try {
    console.log(`(${index + 1}/${total}) Processing ${placeId}`);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 10000 });

    // Try to dismiss cookies
    try {
      await page.waitForSelector('button[aria-label="Afvis alle"]', { timeout: 3000 });
      await page.click('button[aria-label="Afvis alle"]');
    } catch {}

    await page.waitForSelector('button[aria-label^="Billede af"] img', { timeout: 10000 });
    const imageUrl = await page.$eval(
      'button[aria-label^="Billede af"] img',
      img => img.src
    );

    console.log(`✅ Got image for ${placeId}`);
    await page.close();
    return { place_id: placeId, image_url: imageUrl };
  } catch (err) {
    console.warn(`❌ Failed for ${placeId}: ${err.message}`);
    await page.close();
    return { place_id: placeId, image_url: null, error: err.message };
  }
}

(async () => {
  const inputPath = path.join(__dirname, 'detailed_places1.json');
  const data = await fs.readFile(inputPath, 'utf-8');
  const places = JSON.parse(data);

  const browser = await puppeteer.launch({
    headless: false,
    args: ['--lang=en-US', '--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const results = [];

  let index = 0;
  while (index < places.length) {
    const batch = places.slice(index, index + CONCURRENT_PAGES);
    const batchResults = await Promise.all(
      batch.map((place, i) => processPlace(browser, place, index + i, places.length))
    );
    results.push(...batchResults);
    index += CONCURRENT_PAGES;
  }

  await browser.close();

  const outputPath = path.join(__dirname, 'place_pics.json');
  await fs.writeFile(outputPath, JSON.stringify(results, null, 2));
  console.log('✅ All done. Results saved to place_pics.json');
})();
