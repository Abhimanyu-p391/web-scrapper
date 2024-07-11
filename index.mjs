import puppeteer from "puppeteer";
import fs from "fs/promises";

const url = "https://en.wikipedia.org/wiki/India";

const main = async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    const allLinks = await page.evaluate(() => {
        const anchorTags = document.querySelectorAll('a');
        return Array.from(anchorTags)
            .map(anchor => anchor.href)
            .filter(href => href.includes('/en/') || href.startsWith('https://en.wikipedia.org/')); // Filter for English pages
    });

    // Save links to JSON file
    try {
        await fs.writeFile("linkss.json", JSON.stringify(allLinks, null, 2));
        console.log("Links saved to links.json");
    } catch (error) {
        console.error("Error writing file", error);
    }

    await browser.close();
}

main();
