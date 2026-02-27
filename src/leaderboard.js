// ── LEADERBOARD MODULE ────────────────────────────────────────────────────
const API = '/.netlify/functions/leaderboard'

// ── LOCAL PLAYER STORAGE ──────────────────────────────────────────────────
const getKnownPlayers = () => JSON.parse(localStorage.getItem('hm_players') || '[]')

const savePlayer = (initials) => {
    const players = getKnownPlayers()
    if (!players.includes(initials.toUpperCase())) {
        players.unshift(initials.toUpperCase())
        localStorage.setItem('hm_players', JSON.stringify(players))
    }
}

// ── API CALLS ─────────────────────────────────────────────────────────────
const fetchLeaderboard = async () => {
    const res = await fetch(API)
    return res.json()
}

const submitScore = async (entry) => {
    const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry)
    })
    return res.json()
}

// ── INJECT STYLES ─────────────────────────────────────────────────────────
const injectStyles = () => {
    if (document.getElementById('lb-styles')) return
    const style = document.createElement('style')
    style.id = 'lb-styles'
    style.textContent = `
        /* ── DIALOG RESETS ────────────────────────────────── */
        dialog.lb-dialog,
        dialog.lb-player-dialog {
            border: none;
            padding: 0;
            background: transparent;
            max-width: 100%;
            max-height: 100%;
            overflow: visible;
        }

        dialog.lb-dialog::backdrop,
        dialog.lb-player-dialog::backdrop {
            background: rgba(0,0,0,0.78);
            backdrop-filter: blur(4px);
        }

        /* ── LEADERBOARD SHEET (bottom drawer) ────────────── */
        dialog.lb-dialog {
            position: fixed;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 100%;
            max-width: 480px;
            margin: 0;
        }

        .lb-sheet {
            background: #0d1520;
            border: 1px solid #2a3a55;
            border-bottom: none;
            border-radius: 16px 16px 0 0;
            padding: 1.5rem 1.25rem 2rem;
            display: flex;
            flex-direction: column;
            gap: 1.25rem;
            max-height: 85vh;
            overflow-y: auto;
            box-shadow: 0 -8px 40px rgba(0,0,0,0.6), 0 0 40px rgba(0,212,200,0.05);
        }

        /* ── PLAYER DIALOG (centered card) ───────────────── */
        dialog.lb-player-dialog {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            margin: 0;
        }

        .lb-player-card {
            background: #0d1520;
            border: 1px solid #2a3a55;
            border-radius: 12px;
            padding: 2rem 1.5rem;
            width: 90vw;
            max-width: 320px;
            display: flex;
            flex-direction: column;
            gap: 1.25rem;
            box-shadow: 0 0 40px rgba(0,0,0,0.8);
        }

        /* ── DRAG HANDLE ──────────────────────────────────── */
        .lb-handle {
            width: 36px;
            height: 4px;
            background: #2a3a55;
            border-radius: 2px;
            margin: 0 auto -0.5rem;
        }

        /* ── HEADER ───────────────────────────────────────── */
        .lb-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .lb-header-left {
            display: flex;
            flex-direction: column;
            gap: 0.15rem;
        }

        .lb-app-name {
            font-family: 'Share Tech Mono', monospace;
            font-size: 0.875rem;
            letter-spacing: 0.3em;
            text-transform: uppercase;
            color: #6b8aaa;
        }

        .lb-title {
            font-family: 'Black Han Sans', sans-serif;
            font-size: 1.2rem;
            color: #00d4c8;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            text-shadow: 0 0 16px rgba(0,212,200,0.4);
        }

        .lb-close {
            font-family: 'Share Tech Mono', monospace;
            font-size: 0.875rem;
            letter-spacing: 0.1em;
            color: #6b8aaa;
            background: none;
            border: 1px solid #2a3a55;
            border-radius: 4px;
            cursor: pointer;
            padding: 0.35rem 0.65rem;
            transition: color 0.2s, border-color 0.2s;
            min-width: 44px;
            min-height: 44px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .lb-close:hover {
            color: #00d4c8;
            border-color: #00d4c8;
        }

        .lb-close:focus-visible {
            outline: 2px solid #00d4c8;
            outline-offset: 2px;
        }

        /* ── STATS ROW ────────────────────────────────────── */
        .lb-stats {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 0.5rem;
        }

        .lb-stat {
            background: #111827;
            border: 1px solid #2a3a55;
            border-radius: 6px;
            padding: 0.6rem 0.25rem;
            text-align: center;
            display: flex;
            flex-direction: column;
            gap: 0.2rem;
        }

        .lb-stat-val {
            font-family: 'Black Han Sans', sans-serif;
            font-size: 1.3rem;
            color: #f5c842;
        }

        .lb-stat-label {
            font-family: 'Share Tech Mono', monospace;
            font-size: 0.875rem;
            letter-spacing: 0.1em;
            color: #6b8aaa;
            text-transform: uppercase;
        }

        /* ── SECTION LABEL ────────────────────────────────── */
        .lb-section-label {
            font-family: 'Share Tech Mono', monospace;
            font-size: 0.875rem;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            color: #6b8aaa;
            border-bottom: 1px solid #1f2d45;
            padding-bottom: 0.4rem;
        }

        /* ── SCORE TABLE ──────────────────────────────────── */
        .lb-table {
            display: flex;
            flex-direction: column;
            gap: 0.3rem;
        }

        .lb-row {
            display: grid;
            grid-template-columns: 1.5rem 2.5rem 1fr auto auto;
            gap: 0.5rem;
            align-items: center;
            padding: 0.5rem;
            border-radius: 4px;
            font-family: 'Share Tech Mono', monospace;
            font-size: 0.875rem;
        }

        .lb-rank    { color: #6b8aaa; }
        .lb-initials {
            font-family: 'Black Han Sans', sans-serif;
            font-size: 1rem;
            color: #00d4c8;
        }
        .lb-puzzle  { color: #8aabbf; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .lb-score-val {
            font-family: 'Black Han Sans', sans-serif;
            color: #f5c842;
            font-size: 1rem;
        }
        .lb-badge {
            font-size: 0.75rem;
            padding: 0.15rem 0.4rem;
            border-radius: 3px;
            font-family: 'Share Tech Mono', monospace;
        }
        .lb-badge.won  { background: rgba(0,212,200,0.15); color: #00d4c8; }
        .lb-badge.lost { background: rgba(239,68,68,0.12); color: #ff6b6b; }

        .lb-empty {
            font-family: 'Share Tech Mono', monospace;
            font-size: 0.875rem;
            color: #6b8aaa;
            text-align: center;
            padding: 1rem 0;
            letter-spacing: 0.1em;
        }

        /* ── PLAYER CARD HEADER ───────────────────────────── */
        .lb-player-header {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
        }

        .lb-player-app {
            font-family: 'Share Tech Mono', monospace;
            font-size: 0.875rem;
            letter-spacing: 0.3em;
            text-transform: uppercase;
            color: #6b8aaa;
        }

        .lb-player-title {
            font-family: 'Black Han Sans', sans-serif;
            font-size: 1.2rem;
            color: #00d4c8;
            letter-spacing: 0.1em;
            text-transform: uppercase;
        }

        /* ── PLAYER BUTTONS ───────────────────────────────── */
        .lb-player-options {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }

        .lb-player-btn {
            font-family: 'Black Han Sans', sans-serif;
            font-size: 1rem;
            letter-spacing: 0.05em;
            padding: 0.75rem 1rem;
            border-radius: 6px;
            border: 1px solid #2a3a55;
            background: #111827;
            color: #c8dff5;
            cursor: pointer;
            text-align: left;
            transition: background 0.15s, border-color 0.15s, color 0.15s;
            min-height: 44px;
        }

        .lb-player-btn:hover {
            background: #1f2d45;
            border-color: #00d4c8;
            color: #fff;
        }

        .lb-player-btn:focus-visible {
            outline: 2px solid #00d4c8;
            outline-offset: 2px;
        }

        .lb-player-btn.new-player {
            color: #8aabbf;
            font-family: 'Share Tech Mono', monospace;
            font-size: 0.875rem;
            letter-spacing: 0.1em;
        }

        .lb-player-btn.new-player:hover {
            border-color: #f5c842;
            color: #f5c842;
            background: rgba(245,200,66,0.05);
        }

        .lb-player-btn.skip {
            border-color: transparent;
            color: #6b8aaa;
            font-family: 'Share Tech Mono', monospace;
            font-size: 0.875rem;
            letter-spacing: 0.1em;
            text-align: center;
            background: transparent;
        }

        .lb-player-btn.skip:hover {
            color: #8aabbf;
            border-color: #2a3a55;
        }

        /* ── INITIALS FORM ────────────────────────────────── */
        .lb-initials-form {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            align-items: center;
        }

        .lb-initials-label {
            font-family: 'Share Tech Mono', monospace;
            font-size: 0.875rem;
            letter-spacing: 0.15em;
            color: #8aabbf;
            text-transform: uppercase;
            text-align: center;
        }

        .lb-initials-input {
            font-family: 'Black Han Sans', sans-serif;
            font-size: 2rem;
            letter-spacing: 0.5em;
            text-align: center;
            text-transform: uppercase;
            width: 140px;
            background: #111827;
            border: 1px solid #2a3a55;
            border-radius: 6px;
            color: #00d4c8;
            padding: 0.5rem;
            outline: none;
            caret-color: #00d4c8;
        }

        .lb-initials-input:focus {
            border-color: #00d4c8;
            box-shadow: 0 0 12px rgba(0,212,200,0.2);
        }

        .lb-submit-btn {
            font-family: 'Share Tech Mono', monospace;
            font-size: 0.875rem;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            padding: 0.65rem 1.6rem;
            border-radius: 4px;
            border: 1px solid #00d4c8;
            background: transparent;
            color: #00d4c8;
            cursor: pointer;
            transition: background 0.2s, box-shadow 0.2s;
            width: 100%;
            min-height: 44px;
        }

        .lb-submit-btn:hover {
            background: rgba(0,212,200,0.08);
            box-shadow: 0 0 16px rgba(0,212,200,0.3);
        }

        .lb-submit-btn:focus-visible {
            outline: 2px solid #00d4c8;
            outline-offset: 2px;
        }

        .lb-submit-btn:disabled {
            opacity: 0.35;
            cursor: default;
        }

        /* ── LOADING ──────────────────────────────────────── */
        .lb-loading {
            font-family: 'Share Tech Mono', monospace;
            font-size: 0.875rem;
            letter-spacing: 0.2em;
            color: #6b8aaa;
            text-align: center;
            animation: lb-blink 1.2s ease-in-out infinite;
        }

        @keyframes lb-blink {
            0%, 100% { opacity: 1; }
            50%       { opacity: 0.3; }
        }

        /* ── SCORES BUTTON ────────────────────────────────── */
        .lb-btn {
            font-family: 'Share Tech Mono', monospace;
            font-size: 0.875rem;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            background: none;
            border: none;
            color: #6b8aaa;
            cursor: pointer;
            padding: 0.25rem 0;
            transition: color 0.2s;
            min-height: 44px;
        }

        .lb-btn:hover { color: #00d4c8; }

        .lb-btn:focus-visible {
            outline: 2px solid #00d4c8;
            outline-offset: 2px;
            border-radius: 2px;
        }
    `
    document.head.appendChild(style)
}

// ── CLICK OUTSIDE HELPER ──────────────────────────────────────────────────
// Native <dialog> handles ESC automatically.
// For click-outside, we check if the click landed on the ::backdrop.
const onClickOutside = (dialog, callback) => {
    dialog.addEventListener('click', (e) => {
        const rect = dialog.getBoundingClientRect()
        const clickedInside =
            rect.top <= e.clientY &&
            e.clientY <= rect.top + rect.height &&
            rect.left <= e.clientX &&
            e.clientX <= rect.left + rect.width
        if (!clickedInside) callback()
    })
}

// ── PLAYER SELECT ─────────────────────────────────────────────────────────
const selectPlayer = () => new Promise((resolve) => {
    const players = getKnownPlayers()

    const dialog = document.createElement('dialog')
    dialog.className = 'lb-player-dialog'
    dialog.setAttribute('aria-labelledby', 'lb-player-title')

    const card = document.createElement('div')
    card.className = 'lb-player-card'

    const header = document.createElement('div')
    header.className = 'lb-player-header'
    header.innerHTML = `
        <p class="lb-player-app">Hangman</p>
        <h2 class="lb-player-title" id="lb-player-title">Who's Playing?</h2>
    `

    const options = document.createElement('div')
    options.className = 'lb-player-options'

    const closeAndResolve = (initials) => {
        dialog.close()
        dialog.remove()
        resolve(initials)
    }

    // ESC via native dialog — resolve as anonymous
    dialog.addEventListener('cancel', (e) => {
        e.preventDefault()
        closeAndResolve(null)
    })

    onClickOutside(dialog, () => closeAndResolve(null))

    const showInitialsForm = () => {
        options.innerHTML = ''

        const form = document.createElement('div')
        form.className = 'lb-initials-form'

        const label = document.createElement('label')
        label.className = 'lb-initials-label'
        label.htmlFor = 'lb-initials-input'
        label.textContent = 'Enter your initials'

        const input = document.createElement('input')
        input.className = 'lb-initials-input'
        input.id = 'lb-initials-input'
        input.type = 'text'
        input.maxLength = 3
        input.placeholder = 'AAA'
        input.autocomplete = 'off'
        input.setAttribute('aria-label', 'Your initials, up to 3 letters')

        input.addEventListener('input', () => {
            input.value = input.value.toUpperCase().replace(/[^A-Z]/g, '')
            submitBtn.disabled = input.value.length < 1
        })

        const submitBtn = document.createElement('button')
        submitBtn.className = 'lb-submit-btn'
        submitBtn.textContent = 'Start Game'
        submitBtn.disabled = true
        submitBtn.addEventListener('click', () => {
            const initials = input.value.toUpperCase()
            if (!initials) return
            savePlayer(initials)
            closeAndResolve(initials)
        })

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !submitBtn.disabled) submitBtn.click()
        })

        const skipBtn = document.createElement('button')
        skipBtn.className = 'lb-player-btn skip'
        skipBtn.textContent = 'Skip — play anonymously'
        skipBtn.setAttribute('aria-label', 'Play anonymously without saving your score')
        skipBtn.addEventListener('click', () => closeAndResolve(null))

        form.appendChild(label)
        form.appendChild(input)
        form.appendChild(submitBtn)
        form.appendChild(skipBtn)
        options.appendChild(form)
        setTimeout(() => input.focus(), 50)
    }

    if (players.length > 0) {
        players.forEach(p => {
            const btn = document.createElement('button')
            btn.className = 'lb-player-btn'
            btn.textContent = p
            btn.setAttribute('aria-label', `Play as ${p}`)
            btn.addEventListener('click', () => closeAndResolve(p))
            options.appendChild(btn)
        })

        const newBtn = document.createElement('button')
        newBtn.className = 'lb-player-btn new-player'
        newBtn.textContent = '+ New Player'
        newBtn.addEventListener('click', showInitialsForm)
        options.appendChild(newBtn)

        const skipBtn = document.createElement('button')
        skipBtn.className = 'lb-player-btn skip'
        skipBtn.textContent = 'Skip — play anonymously'
        skipBtn.setAttribute('aria-label', 'Play anonymously without saving your score')
        skipBtn.addEventListener('click', () => closeAndResolve(null))
        options.appendChild(skipBtn)
    } else {
        showInitialsForm()
    }

    card.appendChild(header)
    card.appendChild(options)
    dialog.appendChild(card)
    document.body.appendChild(dialog)
    dialog.showModal()

    // Focus first focusable element
    setTimeout(() => {
        const first = dialog.querySelector('button, input')
        first?.focus()
    }, 50)
})

// ── LEADERBOARD MODAL ─────────────────────────────────────────────────────
const showLeaderboard = async () => {
    // Reuse if already in DOM
    const existing = document.getElementById('lb-dialog')
    if (existing) {
        existing.showModal()
        return
    }

    const dialog = document.createElement('dialog')
    dialog.className = 'lb-dialog'
    dialog.id = 'lb-dialog'
    dialog.setAttribute('aria-labelledby', 'lb-modal-title')

    const sheet = document.createElement('div')
    sheet.className = 'lb-sheet'

    sheet.innerHTML = `
        <div class="lb-handle" aria-hidden="true"></div>
        <div class="lb-header">
            <div class="lb-header-left">
                <p class="lb-app-name">Hangman</p>
                <h2 class="lb-title" id="lb-modal-title">Leaderboard</h2>
            </div>
            <button class="lb-close" aria-label="Close leaderboard">✕</button>
        </div>
        <div class="lb-loading" role="status" aria-live="polite">Loading scores...</div>
    `

    dialog.appendChild(sheet)
    document.body.appendChild(dialog)

    const closeDialog = () => dialog.close()

    dialog.addEventListener('cancel', closeDialog)
    onClickOutside(dialog, closeDialog)
    sheet.querySelector('.lb-close').addEventListener('click', closeDialog)

    dialog.showModal()
    setTimeout(() => sheet.querySelector('.lb-close')?.focus(), 50)

    try {
        const data = await fetchLeaderboard()
        renderLeaderboard(sheet, data, closeDialog)
    } catch {
        sheet.querySelector('.lb-loading').textContent = 'Could not load scores.'
    }
}

// ── RENDER LEADERBOARD ────────────────────────────────────────────────────
const renderLeaderboard = (sheet, data, closeDialog) => {
    const winRate = data.gamesPlayed
        ? Math.round((data.gamesWon / data.gamesPlayed) * 100)
        : 0

    sheet.innerHTML = `
        <div class="lb-handle" aria-hidden="true"></div>
        <div class="lb-header">
            <div class="lb-header-left">
                <p class="lb-app-name">Hangman</p>
                <h2 class="lb-title" id="lb-modal-title">Leaderboard</h2>
            </div>
            <button class="lb-close" aria-label="Close leaderboard">✕</button>
        </div>
        <div class="lb-stats" role="region" aria-label="Game statistics">
            <div class="lb-stat">
                <div class="lb-stat-val">${data.highScore}</div>
                <div class="lb-stat-label">Best</div>
            </div>
            <div class="lb-stat">
                <div class="lb-stat-val">${winRate}%</div>
                <div class="lb-stat-label">Win Rate</div>
            </div>
            <div class="lb-stat">
                <div class="lb-stat-val">${data.currentStreak}</div>
                <div class="lb-stat-label">Streak</div>
            </div>
            <div class="lb-stat">
                <div class="lb-stat-val">${data.bestStreak}</div>
                <div class="lb-stat-label">Best Streak</div>
            </div>
        </div>
        <div class="lb-section-label">Top 10 Scores</div>
        <div class="lb-table" id="lb-top10" role="list" aria-label="Top 10 scores"></div>
        <div class="lb-section-label">Recent Games</div>
        <div class="lb-table" id="lb-recent" role="list" aria-label="Recent games"></div>
    `

    sheet.querySelector('.lb-close').addEventListener('click', closeDialog)

    const top10 = [...data.scores].sort((a, b) => b.score - a.score).slice(0, 10)
    const top10El = sheet.querySelector('#lb-top10')
    if (top10.length === 0) {
        top10El.innerHTML = '<div class="lb-empty">No scores yet — be the first!</div>'
    } else {
        top10.forEach((entry, i) => top10El.appendChild(buildRow(entry, i + 1)))
    }

    const recentEl = sheet.querySelector('#lb-recent')
    const recent = data.scores.slice(0, 10)
    if (recent.length === 0) {
        recentEl.innerHTML = '<div class="lb-empty">No games played yet</div>'
    } else {
        recent.forEach((entry, i) => recentEl.appendChild(buildRow(entry, i + 1, true)))
    }
}

const buildRow = (entry, rank, showDate = false) => {
    const row = document.createElement('div')
    row.className = 'lb-row'
    row.setAttribute('role', 'listitem')
    row.setAttribute('aria-label',
        `Rank ${rank}: ${entry.initials}, puzzle: ${entry.puzzle}, score: ${entry.score}, ${entry.won ? 'win' : 'fail'}`
    )

    const date = new Date(entry.date).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })

    row.innerHTML = `
        <span class="lb-rank" aria-hidden="true">${rank}</span>
        <span class="lb-initials" aria-hidden="true">${entry.initials || '???'}</span>
        <span class="lb-puzzle" aria-hidden="true">${showDate ? date : entry.puzzle}</span>
        <span class="lb-score-val" aria-hidden="true">${entry.score}</span>
        <span class="lb-badge ${entry.won ? 'won' : 'lost'}" aria-hidden="true">${entry.won ? 'WIN' : 'FAIL'}</span>
    `
    return row
}

// ── SUBMIT SCORE ──────────────────────────────────────────────────────────
const submitGameScore = async (initials, puzzle, score, won, guessesLeft) => {
    return submitScore({
        initials: initials.toUpperCase(),
        puzzle,
        score,
        won,
        guessesLeft,
        date: new Date().toISOString()
    })
}

// ── INIT ──────────────────────────────────────────────────────────────────
const initLeaderboard = (headerEl) => {
    injectStyles()

    const btn = document.createElement('button')
    btn.className = 'lb-btn'
    btn.textContent = 'Scores'
    btn.setAttribute('aria-label', 'View leaderboard')
    btn.addEventListener('click', showLeaderboard)
    headerEl.appendChild(btn)
}

export { initLeaderboard, selectPlayer, submitGameScore, showLeaderboard }