import puppeteer from "puppeteer";
import fs from "fs/promises";

const main = async () => {
    // Read links from the JSON file
    let links;
    try {
        const data = await fs.readFile("test.json", "utf-8");
        links = JSON.parse(data);
    } catch (error) {
        console.error("Error reading links file", error);
        return;
    }

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Array to hold extracted data
    const extractedData = [];

    // Visit each link and extract all text content
    for (const link of links) {
        try {
            await page.goto(link);

            // Extract all text content from the page
            const data = await page.evaluate(() => {
                const allText = document.body.innerText;
                return allText;
            });

            // Store the link and extracted text in an object
            const pageData = {
                link,
                textContent: data
            };

            extractedData.push(pageData);
        } catch (error) {
            console.error(`Error visiting link ${link}`, error);
        }
    }

    await browser.close();

    // Create an index mapping links to their text content
    const index = {};
    extractedData.forEach(({ link, textContent }) => {
        index[link] = textContent;
    });

    // Save the extracted data and index to JSON files
    try {
        await fs.writeFile("extractedData.json", JSON.stringify(extractedData, null, 2));
        await fs.writeFile("index.json", JSON.stringify(index, null, 2));
        console.log("Extracted data and index saved successfully.");
    } catch (error) {
        console.error("Error writing files", error);
    }
}

main();
