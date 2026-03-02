const JSONBIN_URL = `https://api.jsonbin.io/v3/b/${process.env.JSONBIN_BIN_ID}`
const HEADERS = {
    'Content-Type': 'application/json',
    'X-Master-Key': process.env.JSONBIN_API_KEY
}

exports.handler = async (event) => {

    // GET — fetch leaderboard
    // if (event.httpMethod === 'GET') {
    //     try {
    //         const response = await fetch(JSONBIN_URL, { headers: HEADERS })
    //         const data = await response.json()
    //         return {
    //             statusCode: 200,
    //             body: JSON.stringify(data.record)
    //         }
    //     } catch (err) {
    //         return { statusCode: 500, body: JSON.stringify({ error: 'Failed to fetch leaderboard' }) }
    //     }
    // }

    // POST — submit a new score
    if (event.httpMethod === 'POST') {
        try {
             // Fetch current data first
            const newEntry = JSON.parse(event.body)

        const getResponse = await fetch(JSONBIN_URL, { headers: HEADERS })
       
        const text = await getResponse.text()
      
        const getData = JSON.parse(text)
        const current = getData.record

            // Build updated record
            const updatedScores = []; // empty out
            const gamesPlayed = 0;
            const gamesWon = 0;
            const currentStreak = 0;
            const bestStreak = 0;
            const highScore = 0;

            const updated = {
                scores: updatedScores,
                highScore,
                gamesPlayed,
                gamesWon,
                currentStreak,
                bestStreak
            }

            // Write back to JSONBin
            const putResponse = await fetch(JSONBIN_URL, {
                method: 'PUT',
                headers: HEADERS,
                body: JSON.stringify(updated)
            })

            const putData = await putResponse.json()
            return {
                statusCode: 200,
                body: JSON.stringify(putData.record)
            }
        } catch (err) {
            return { statusCode: 500, body: JSON.stringify({ error: 'Failed to update leaderboard' }) }
        }
    }

    return { statusCode: 405, body: 'Method not allowed' }
}