const JSONBIN_URL = `https://api.jsonbin.io/v3/b/${process.env.JSONBIN_BIN_ID}`
const HEADERS = {
    'Content-Type': 'application/json',
    'X-Master-Key': process.env.JSONBIN_API_KEY
}

exports.handler = async (event) => {
      console.log('BIN_ID:', process.env.JSONBIN_BIN_ID)
    console.log('KEY exists:', !!process.env.JSONBIN_API_KEY)
console.log("./netlify/func/leaderboard.JS: running handler")
    // GET — fetch leaderboard
    if (event.httpMethod === 'GET') {
        try {
            const response = await fetch(JSONBIN_URL, { headers: HEADERS })
            const data = await response.json()
            return {
                statusCode: 200,
                body: JSON.stringify(data.record)
            }
        } catch (err) {
            return { statusCode: 500, body: JSON.stringify({ error: 'Failed to fetch leaderboard' }) }
        }
    }

    // POST — submit a new score
    if (event.httpMethod === 'POST') {
        try {
             // Fetch current data first
            const newEntry = JSON.parse(event.body)

        console.log('New entry:', newEntry)

        const getResponse = await fetch(JSONBIN_URL, { headers: HEADERS })
        console.log('GET status:', getResponse.status)
        const text = await getResponse.text()
        console.log('GET response:', text)
        const getData = JSON.parse(text)
        const current = getData.record

            // Build updated record
            const updatedScores = [newEntry, ...current.scores].slice(0, 50) // keep last 50
            const gamesPlayed = current.gamesPlayed + 1
            const gamesWon = current.gamesWon + (newEntry.won ? 1 : 0)
            const currentStreak = newEntry.won ? current.currentStreak + 1 : 0
            const bestStreak = Math.max(current.bestStreak, currentStreak)
            const highScore = Math.max(current.highScore, newEntry.score)

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