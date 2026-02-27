const fallbackPuzzles = [
    // Idioms & Expressions
    "bite the bullet now",
    "break a leg tonight",
    "burn the midnight oil",
    "hit the nail head",
    "let the cat out",
    "once in a blue",
    "spill the beans already",
    "the ball is rolling",
    "under the weather today",
    "you reap what sow",
    "add fuel to fire",
    "back against the wall",
    "beat around the bush",
    "bend over backwards now",
    "bite off more than",
    "blow off some steam",
    "caught red handed again",
    "cost an arm leg",
    "cut to the chase",
    "devil is in details",
    "dont judge book cover",
    "every cloud has lining",
    "feel under the weather",
    "get out of dodge",
    "give benefit of doubt",
    "go back to basics",
    "hit the ground running",
    "jump on the bandwagon",
    "keep your chin up",
    "kick the bucket soon",
    "kill two birds one",
    "let sleeping dogs lie",
    "miss the boat entirely",
    "no pain no gain",
    "on the fence still",
    "out on a limb",
    "penny for your thoughts",
    "read between the lines",
    "steal the whole show",
    "the tip of iceberg",
    "throw caution to wind",
    "tie up loose ends",
    "turn over new leaf",
    "twist of cruel fate",
    "under the same roof",
    "up in the air",
    "wear your heart outside",
    "when pigs finally fly",
    "you hit the jackpot",
    "your guess is mine",
]

const getRandomFallback = () => {
    return fallbackPuzzles[Math.floor(Math.random() * fallbackPuzzles.length)]
}

const getPuzzle = async (wordCount) => {
    try {
        const response = await fetch(`https://puzzle.mead.io/puzzle?wordCount=${wordCount}`)
        if (response.status === 200) {
            const data = await response.json()
            return data.puzzle
        }
        throw new Error('Bad response.')
    } catch (e) {
        console.warn('Puzzle API unavailable, using fallback.', e)
        return getRandomFallback()
    }
}

export { getPuzzle as default }