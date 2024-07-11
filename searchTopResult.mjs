import fs from "fs/promises";

const searchTopResults = async (query, numResults = 10) => {
    try {
        // Read index file
        const indexData = await fs.readFile("index.json", "utf-8");
        const index = JSON.parse(indexData);

        // Array to store top results
        let topResults = [];

        // Function to compute score for a given link and query
        const computeScore = (textContent, query) => {
            // Simple scoring example: count occurrences of query in textContent
            const regex = new RegExp(query, "gi");
            const matches = textContent.match(regex);
            return matches ? matches.length : 0;
        }

        // Iterate through each entry in index and compute score
        Object.entries(index).forEach(([link, textContent]) => {
            const score = computeScore(textContent, query);

            // Insert into topResults array while maintaining descending order by score
            let inserted = false;
            for (let i = 0; i < topResults.length; i++) {
                if (score > topResults[i].score) {
                    topResults.splice(i, 0, { link, score });
                    inserted = true;
                    break;
                }
            }
            if (!inserted && topResults.length < numResults) {
                topResults.push({ link, score });
            }
            if (topResults.length > numResults) {
                topResults.pop();
            }
        });

        // Print the top results
        console.log(`Top ${numResults} results for query "${query}":`);
        topResults.forEach((result, index) => {
            console.log(`${index + 1}. Link: ${result.link}`);
            console.log(`   Score: ${result.score}`);
        });
    } catch (error) {
        console.error("Error searching top results", error);
    }
}

const query = "india";
searchTopResults(query, 10);
