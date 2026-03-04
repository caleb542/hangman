const puzzles = require('./data/puzzles.json');

exports.handler = async (event) => {
    const wordCount = event.queryStringParameters?.wordCount || 3;

    try {
        const response = await fetch(`https://puzzle.mead.io/puzzle?wordCount=${wordCount}`);
        if (response.ok) {
            const data = await response.json();
            return {
                statusCode: 200,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            };
        }
        throw new Error(`Mead API: ${response.statusText}`);
    } catch (e) {
        console.warn('Mead API failed, using puzzles.json fallback.', e.message);
        const puzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ puzzle })
        };
    }
};