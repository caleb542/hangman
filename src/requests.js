const fallbackPuzzles = [
    // 3 word phrases
    "break a leg",
    "bite the bullet",
    "hit the road",
    "spill the beans",
    "kick the bucket",
    "beat the clock",
    "miss the boat",
    "steal the show",
    "face the music",
    "bend the rules",
    "clear the air",
    "raise the bar",
    "rock the boat",
    "save the day",
    "bite the dust",
    "push the envelope",
    "blow the whistle",
    "jump the gun",
    "pass the buck",
    "pull the plug",

    // 4 word phrases
    "once in a while",
    "back to square one",
    "beat around the bush",
    "cut to the chase",
    "read between the lines",
    "up in the air",
    "out on a limb",
    "turn over a leaf",
    "let sleeping dogs lie",
    "burn the midnight oil",
    "get out of dodge",
    "blow off some steam",
    "keep your chin up",
    "no pain no gain",
    "throw in the towel",
    "carry your own weight",
    "caught red handed again",
    "give the cold shoulder",
    "hit the ground running",
    "penny for your thoughts",
    "tie up loose ends",
    "throw caution to wind",
    "the tip of iceberg",
    "jump on the bandwagon",
    "add fuel to fire",

    // 5 word phrases
    "once in a blue moon",
    "you reap what you sow",
    "dont judge a book cover",
    "the best of both worlds",
    "every dog has its day",
    "actions speak louder than words",
    "all that glitters is gold",
    "two wrongs dont make right",
    "the early bird catches worm",
    "better late than never though",
]

// ── SHUFFLE ───────────────────────────────────────────────────────────────
const shuffle = (arr) => {
    const a = [...arr]
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]]
    }
    return a
}

// ── PERSISTENT QUEUE ──────────────────────────────────────────────────────
// Stores a shuffled index list in localStorage.
// Each game pops the next index, persists the remainder.
// When empty, reshuffles and starts again.
const LS_KEY = 'hm_queue'

const getQueue = () => {
    try {
        const stored = JSON.parse(localStorage.getItem(LS_KEY))
        if (Array.isArray(stored) && stored.length > 0) return stored
    } catch {}
    return null
}

const saveQueue = (queue) => {
    localStorage.setItem(LS_KEY, JSON.stringify(queue))
}

const getNextFallback = () => {
    let queue = getQueue()

    if (!queue) {
        queue = shuffle([...Array(fallbackPuzzles.length).keys()])
        saveQueue(queue)
    }

    const index = queue.pop()
    saveQueue(queue)

    return fallbackPuzzles[index]
}

// ── GET PUZZLE ────────────────────────────────────────────────────────────
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
        return getNextFallback()
    }
}

export { getPuzzle as default }