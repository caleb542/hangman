// ── LEADERBOARD MODULE ────────────────────────────────────────────────────
// Handles player selection, score submission, and leaderboard display

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
        /* ── OVERLAY ──────────────────────────────────────── */
        .lb-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.75);
            backdrop-filter: blur(4px);
            display: flex;
            align-items: flex-end;
            justify-content: center;
            z-index: 100;
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
        }

        .lb-overlay.open {
            opacity: 1;
            pointer-events: all;
        }

        /* ── SHEET ────────────────────────────────────────── */
        .lb-sheet {
            width: 100%;
            max-width: 480px;
            background: #0d1520;
            border: 1px solid #1f2d45;
            border-bottom: none;
            border-radius: 16px 16px 0 0;
            padding: 1.5rem 1.25rem 2rem;
            display: flex;
            flex-direction: column;
            gap: 1.25rem;
            max-height: 85vh;
            overflow-y: auto;
            transform: translateY(100%);
            transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 -8px 40px rgba(0,0,0,0.6), 0 0 40px rgba(0,212,200,0.05);
        }

        .lb-overlay.open .lb-sheet {
            transform: translateY(0);
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

        .lb-title {
            font-family: 'Black Han Sans', sans-serif;
            font-size: 1rem;
            color: #00d4c8;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            text-shadow: 0 0 16px rgba(0,212,200,0.4);
        }

        .lb-close {
            font-family: 'Share Tech Mono', monospace;
            font-size: 0.7rem;
            letter-spacing: 0.1em;
            color: #2a3a55;
            background: none;
            border: none;
            cursor: pointer;
            padding: 0.25rem 0.5rem;
            transition: color 0.2s;
        }

        .lb-close:hover { color: #00d4c8; }

        /* ── STATS ROW ────────────────────────────────────── */
        .lb-stats {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 0.5rem;
        }

        .lb-stat {
            background: #111827;
            border: 1px solid #1f2d45;
            border-radius: 6px;
            padding: 0.6rem 0.25rem;
            text-align: center;
            display: flex;
            flex-direction: column;
            gap: 0.2rem;
        }

        .lb-stat-val {
            font-family: 'Black Han Sans', sans-serif;
            font-size: 1.2rem;
            color: #f5c842;
        }

        .lb-stat-label {
            font-family: 'Share Tech Mono', monospace;
            font-size: 0.55rem;
            letter-spacing: 0.15em;
            color: #2a3a55;
            text-transform: uppercase;
        }

        /* ── SECTION LABEL ────────────────────────────────── */
        .lb-section-label {
            font-family: 'Share Tech Mono', monospace;
            font-size: 0.65rem;
            letter-spacing: 0.25em;
            text-transform: uppercase;
            color: #2a3a55;
            border-bottom: 1px solid #1f2d45;
            padding-bottom: 0.4rem;
        }

        /* ── TOP SCORES TABLE ─────────────────────────────── */
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
            padding: 0.4rem 0.5rem;
            border-radius: 4px;
            font-family: 'Share Tech Mono', monospace;
            font-size: 0.75rem;
        }

        .lb-row.highlight {
            background: rgba(0,212,200,0.06);
            border: 1px solid rgba(0,212,200,0.15);
        }

        .lb-rank { color: #2a3a55; font-size: 0.65rem; }
        .lb-initials {
            font-family: 'Black Han Sans', sans-serif;
            font-size: 0.9rem;
            color: #00d4c8;
            letter-spacing: 0.05em;
        }
        .lb-puzzle {
            color: #4a6080;
            font-size: 0.65rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .lb-score-val {
            font-family: 'Black Han Sans', sans-serif;
            color: #f5c842;
            font-size: 0.9rem;
        }
        .lb-badge {
            font-size: 0.6rem;
            padding: 0.1rem 0.35rem;
            border-radius: 3px;
            letter-spacing: 0.05em;
        }
        .lb-badge.won  { background: rgba(0,212,200,0.15); color: #00d4c8; }
        .lb-badge.lost { background: rgba(239,68,68,0.12); color: #ef4444; }

        /* ── PLAYER SELECT MODAL ──────────────────────────── */
        .lb-player-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.85);
            backdrop-filter: blur(6px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 200;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.25s ease;
        }

        .lb-player-overlay.open {
            opacity: 1;
            pointer-events: all;
        }

        .lb-player-card {
            background: #0d1520;
            border: 1px solid #1f2d45;
            border-radius: 12px;
            padding: 2rem 1.5rem;
            width: 90%;
            max-width: 320px;
            display: flex;
            flex-direction: column;
            gap: 1.25rem;
            box-shadow: 0 0 40px rgba(0,0,0,0.8);
            transform: scale(0.95);
            transition: transform 0.25s ease;
        }

        .lb-player-overlay.open .lb-player-card {
            transform: scale(1);
        }

        .lb-player-title {
            font-family: 'Black Han Sans', sans-serif;
            font-size: 1rem;
            color: #00d4c8;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            text-align: center;
        }

        .lb-player-options {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }

        .lb-player-btn {
            font-family: 'Black Han Sans', sans-serif;
            font-size: 1rem;
            letter-spacing: 0.05em;
            padding: 0.65rem 1rem;
            border-radius: 6px;
            border: 1px solid #1f2d45;
            background: #111827;
            color: #c8dff5;
            cursor: pointer;
            text-align: left;
            transition: background 0.15s, border-color 0.15s, color 0.15s;
        }

        .lb-player-btn:hover {
            background: #1f2d45;
            border-color: #00d4c8;
            color: #fff;
        }

        .lb-player-btn.new-player {
            border-color: #2a3a55;
            color: #2a3a55;
            font-family: 'Share Tech Mono', monospace;
            font-size: 0.8rem;
            letter-spacing: 0.1em;
        }

        .lb-player-btn.new-player:hover {
            border-color: #f5c842;
            color: #f5c842;
            background: rgba(245,200,66,0.05);
        }

        /* ── INITIALS INPUT ───────────────────────────────── */
        .lb-initials-form {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            align-items: center;
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

        .lb-initials-hint {
            font-family: 'Share Tech Mono', monospace;
            font-size: 0.65rem;
            letter-spacing: 0.15em;
            color: #2a3a55;
            text-transform: uppercase;
            text-align: center;
        }

        .lb-submit-btn {
            font-family: 'Share Tech Mono', monospace;
            font-size: 0.75rem;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            padding: 0.55rem 1.6rem;
            border-radius: 4px;
            border: 1px solid #00d4c8;
            background: transparent;
            color: #00d4c8;
            cursor: pointer;
            transition: background 0.2s, box-shadow 0.2s;
            width: 100%;
        }

        .lb-submit-btn:hover {
            background: rgba(0,212,200,0.08);
            box-shadow: 0 0 16px rgba(0,212,200,0.3);
        }

        .lb-submit-btn:disabled {
            opacity: 0.3;
            cursor: default;
        }

        /* ── LOADING ──────────────────────────────────────── */
        .lb-loading {
            font-family: 'Share Tech Mono', monospace;
            font-size: 0.7rem;
            letter-spacing: 0.2em;
            color: #2a3a55;
            text-align: center;
            animation: lb-blink 1.2s ease-in-out infinite;
        }

        @keyframes lb-blink {
            0%, 100% { opacity: 1; }
            50%       { opacity: 0.3; }
        }

        /* ── LEADERBOARD BUTTON ───────────────────────────── */
        .lb-btn {
            font-family: 'Share Tech Mono', monospace;
            font-size: 0.65rem;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            background: none;
            border: none;
            color: #2a3a55;
            cursor: pointer;
            padding: 0;
            transition: color 0.2s;
        }

        .lb-btn:hover { color: #00d4c8; }
    `
    document.head.appendChild(style)
}

// ── PLAYER SELECT ─────────────────────────────────────────────────────────
const selectPlayer = () => new Promise((resolve) => {
    const players = getKnownPlayers()
    const overlay = document.createElement('div')
    overlay.className = 'lb-player-overlay'

    const card = document.createElement('div')
    card.className = 'lb-player-card'

    const title = document.createElement('div')
    title.className = 'lb-player-title'
    title.textContent = "Who's Playing?"

    const options = document.createElement('div')
    options.className = 'lb-player-options'

    const showInitialsForm = () => {
        options.innerHTML = ''
        const form = document.createElement('div')
        form.className = 'lb-initials-form'

        const hint = document.createElement('div')
        hint.className = 'lb-initials-hint'
        hint.textContent = 'Enter your initials'

        const input = document.createElement('input')
        input.className = 'lb-initials-input'
        input.maxLength = 3
        input.placeholder = 'AAA'
        input.autocomplete = 'off'
        input.spellcheck = false

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

        form.appendChild(hint)
        form.appendChild(input)
        form.appendChild(submitBtn)
        options.appendChild(form)
        setTimeout(() => input.focus(), 50)
    }

    // Known players list
    if (players.length > 0) {
        players.forEach(p => {
            const btn = document.createElement('button')
            btn.className = 'lb-player-btn'
            btn.textContent = p
            btn.addEventListener('click', () => closeAndResolve(p))
            options.appendChild(btn)
        })
    }

    // New player option
    const newBtn = document.createElement('button')
    newBtn.className = 'lb-player-btn new-player'
    newBtn.textContent = '+ New Player'
    newBtn.addEventListener('click', showInitialsForm)
    options.appendChild(newBtn)

    // If no known players go straight to initials form
    if (players.length === 0) showInitialsForm()

    card.appendChild(title)
    card.appendChild(options)
    overlay.appendChild(card)
    document.body.appendChild(overlay)

    requestAnimationFrame(() => overlay.classList.add('open'))

    const closeAndResolve = (initials) => {
        overlay.classList.remove('open')
        setTimeout(() => overlay.remove(), 300)
        resolve(initials)
    }
})

// ── LEADERBOARD MODAL ─────────────────────────────────────────────────────
const showLeaderboard = async () => {
    const existing = document.getElementById('lb-overlay')
    if (existing) {
        existing.classList.add('open')
        return
    }

    const overlay = document.createElement('div')
    overlay.className = 'lb-overlay'
    overlay.id = 'lb-overlay'

    const sheet = document.createElement('div')
    sheet.className = 'lb-sheet'

    sheet.innerHTML = `
        <div class="lb-handle"></div>
        <div class="lb-header">
            <div class="lb-title">Leaderboard</div>
            <button class="lb-close">Close ✕</button>
        </div>
        <div class="lb-loading">Loading scores...</div>
    `

    overlay.appendChild(sheet)
    document.body.appendChild(overlay)

    // Close on overlay click or button
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.classList.remove('open')
    })
    sheet.querySelector('.lb-close').addEventListener('click', () => {
        overlay.classList.remove('open')
    })

    requestAnimationFrame(() => overlay.classList.add('open'))

    try {
        const data = await fetchLeaderboard()
        renderLeaderboard(sheet, data)
    } catch {
        sheet.querySelector('.lb-loading').textContent = 'Could not load scores.'
    }
}

const renderLeaderboard = (sheet, data) => {
    const winRate = data.gamesPlayed
        ? Math.round((data.gamesWon / data.gamesPlayed) * 100)
        : 0

    sheet.innerHTML = `
        <div class="lb-handle"></div>
        <div class="lb-header">
            <div class="lb-title">Leaderboard</div>
            <button class="lb-close">Close ✕</button>
        </div>

        <div class="lb-stats">
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
        <div class="lb-table" id="lb-top10"></div>

        <div class="lb-section-label">Recent Games</div>
        <div class="lb-table" id="lb-recent"></div>
    `

    sheet.querySelector('.lb-close').addEventListener('click', () => {
        document.getElementById('lb-overlay').classList.remove('open')
    })

    // Top 10 — sorted by score desc
    const top10 = [...data.scores]
        .sort((a, b) => b.score - a.score)
        .slice(0, 10)

    const top10El = sheet.querySelector('#lb-top10')
    top10.forEach((entry, i) => {
        top10El.appendChild(buildRow(entry, i + 1))
    })

    // Recent games — as submitted (newest first)
    const recentEl = sheet.querySelector('#lb-recent')
    data.scores.slice(0, 10).forEach((entry, i) => {
        recentEl.appendChild(buildRow(entry, i + 1, true))
    })
}

const buildRow = (entry, rank, showDate = false) => {
    const row = document.createElement('div')
    row.className = 'lb-row'

    const date = new Date(entry.date).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })

    row.innerHTML = `
        <span class="lb-rank">${rank}</span>
        <span class="lb-initials">${entry.initials || '???'}</span>
        <span class="lb-puzzle">${showDate ? date : entry.puzzle}</span>
        <span class="lb-score-val">${entry.score}</span>
        <span class="lb-badge ${entry.won ? 'won' : 'lost'}">${entry.won ? 'WIN' : 'FAIL'}</span>
    `

    return row
}

// ── SUBMIT SCORE ──────────────────────────────────────────────────────────
const submitGameScore = async (initials, puzzle, score, won, guessesLeft) => {
    const entry = {
        initials: initials.toUpperCase(),
        puzzle,
        score,
        won,
        guessesLeft,
        date: new Date().toISOString()
    }
    return submitScore(entry)
}

// ── INIT ──────────────────────────────────────────────────────────────────
const initLeaderboard = (headerEl) => {
    injectStyles()

    // Add leaderboard button to header
    const btn = document.createElement('button')
    btn.className = 'lb-btn'
    btn.textContent = 'Scores'
    btn.addEventListener('click', showLeaderboard)
    headerEl.appendChild(btn)
}

export { initLeaderboard, selectPlayer, submitGameScore, showLeaderboard }