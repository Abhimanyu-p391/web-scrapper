const express = require("express");
const fs = require("fs").promises;
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

// Endpoint to handle search requests
app.get("/search", async (req, res) => {
    const query = req.query.query;
    if (!query) {
        return res.status(400).json({ error: "Missing search query." });
    }

    try {
        // Read index file
        const indexData = await fs.readFile(path.join(__dirname, "index.json"), "utf-8");
        const index = JSON.parse(indexData);

        // Array to store top results
        let topResults = [];

        // Function to compute score for a given textContent and query
        const computeScore = (textContent, query) => {
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
            if (!inserted && topResults.length < 10) {
                topResults.push({ link, score });
            }
            if (topResults.length > 10) {
                topResults.pop();
            }
        });

        // Send top results as JSON response
        res.json({ results: topResults });
    } catch (error) {
        console.error("Error searching top results", error);
        res.status(500).json({ error: "An error occurred while searching top results." });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
