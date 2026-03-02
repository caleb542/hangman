import Hangman from './hangman'
import getPuzzle from './requests'
import { initLeaderboard, selectPlayer, submitGameScore, showLeaderboard } from './leaderboard'
import './styles/style.css'

// ── CONSTANTS ─────────────────────────────────────────────────────────────
const MAX_GUESSES = 5
const KEY_ROWS = [
    ['A','B','C','D','E','F','G'],
    ['H','I','J','K','L','M','N'],
    ['O','P','Q','R','S','T','U'],
    ['V','W','X','Y','Z']
]

// ── STATE ─────────────────────────────────────────────────────────────────
let game
let score = 0
let currentPlayer = null
let bestScore = parseInt(localStorage.getItem('hm_best') || '0')

// ── DOM REFS ──────────────────────────────────────────────────────────────
const boardEl    = document.getElementById('board')
const keyboardEl = document.getElementById('keyboard')
const statusEl   = document.getElementById('status')
const hpFill     = document.getElementById('hp-fill')
const hpCount    = document.getElementById('hp-count')
const scoreEl    = document.getElementById('score')
const bestEl     = document.getElementById('best')
const headerEl   = document.querySelector('.game-header')

// ── INIT LEADERBOARD ──────────────────────────────────────────────────────
initLeaderboard(headerEl)

// ── BUILD KEYBOARD ────────────────────────────────────────────────────────
KEY_ROWS.forEach(row => {
    const rowEl = document.createElement('div')
    rowEl.className = 'key-row'

    row.forEach(letter => {
        const key = document.createElement('button')
        key.className = 'key'
        key.textContent = letter
        key.dataset.letter = letter
        key.setAttribute('aria-label', `Letter ${letter}`)
        key.addEventListener('click', () => handleGuess(letter))
        rowEl.appendChild(key)
    })

    keyboardEl.appendChild(rowEl)
})

// ── BUILD BOARD ───────────────────────────────────────────────────────────
function buildBoard(phrase) {
    boardEl.innerHTML = ''

    phrase.split(' ').forEach(word => {
        const rowEl = document.createElement('div')
        rowEl.className = 'word-row'

        ;[...word.toUpperCase()].forEach(char => {
            const wrap = document.createElement('div')
            wrap.className = 'tile-wrap'

            const tile = document.createElement('div')
            tile.className = 'tile'
            tile.dataset.char = char

            tile.innerHTML = `
                <div class="tile-front"></div>
                <div class="tile-back"><span class="letter">${char}</span></div>
            `

            wrap.appendChild(tile)
            rowEl.appendChild(wrap)
        })

        boardEl.appendChild(rowEl)
    })
}

// ── REVEAL TILES ──────────────────────────────────────────────────────────
function revealLetter(letter) {
    const tiles = boardEl.querySelectorAll(`.tile[data-char="${letter.toUpperCase()}"]`)
    tiles.forEach((tile, i) => {
        setTimeout(() => tile.classList.add('flipped'), i * 100)
    })
    return tiles.length
}

function revealAll() {
    const tiles = boardEl.querySelectorAll('.tile:not(.flipped)')
    tiles.forEach((tile, i) => {
        setTimeout(() => tile.classList.add('flipped'), i * 60)
    })
}

// ── HP ────────────────────────────────────────────────────────────────────
function updateHP() {
    const pct = (game.remainingGuesses / MAX_GUESSES) * 100

    hpFill.style.width = pct + '%'
    hpFill.className = 'hp-fill'
    hpCount.className = 'hp-count'
    hpCount.textContent = `${game.remainingGuesses} / ${MAX_GUESSES}`

    if (pct <= 33) {
        hpFill.classList.add('low')
        hpCount.classList.add('low')
    } else if (pct <= 66) {
        hpFill.classList.add('mid')
        hpCount.classList.add('mid')
    }
}

// ── SCORE ─────────────────────────────────────────────────────────────────
function updateScore() {
    scoreEl.textContent = score
    if (score > bestScore) {
        bestScore = score
        localStorage.setItem('hm_best', bestScore)
    }
    bestEl.textContent = bestScore
}

// ── STATUS ────────────────────────────────────────────────────────────────
function updateStatus() {
    statusEl.className = 'status-message'

    if (game.status === 'playing') {
        statusEl.textContent = ''
    } else if (game.status === 'finished') {
        statusEl.classList.add('win')
        statusEl.textContent = `Solved! +${game.remainingGuesses * 10} bonus`
    } else if (game.status === 'failed') {
        statusEl.classList.add('lose')
        statusEl.textContent = `The phrase was: "${game.word.join('')}"`
    }
}

// ── HANDLE GUESS ──────────────────────────────────────────────────────────
function handleGuess(letter) {
     // If the game failed to load, don't try to process guesses
    if (!game) return; 

    if (game.status !== 'playing') return

    const result = game.makeGuess(letter)
    if (!result || !result.isUnique) return

    const key = document.querySelector(`.key[data-letter="${letter.toUpperCase()}"]`)

    if (result.isCorrect) {
        const count = revealLetter(letter)
        score += count * 5
        updateScore()
        key?.classList.add('correct')
    } else {
        updateHP()
        key?.classList.add('wrong')

        if (game.remainingGuesses <= 2) {
            document.body.classList.add('shake')
            setTimeout(() => document.body.classList.remove('shake'), 300)
        }
    }

    setTimeout(() => {
        key?.classList.remove('correct', 'wrong')
        key?.classList.add('used')
    }, 560)

    updateStatus()

    if (game.status === 'finished') {
        score += game.remainingGuesses * 10
        updateScore()
        setTimeout(() => {
            revealAll()
            endGame(true)
        }, 400)
    } else if (game.status === 'failed') {
        setTimeout(() => {
            revealAll()
            endGame(false)
        }, 600)
    }
}

// ── END GAME ──────────────────────────────────────────────────────────────
async function endGame(won) {
    if (!currentPlayer) return

    await submitGameScore(
        currentPlayer,
        game.word.join(''),
        score,
        won,
        game.remainingGuesses
    )

    setTimeout(() => showLeaderboard(), 800)
}

// ── KEYBOARD HANDLER ──────────────────────────────────────────────────────
window.addEventListener('keypress', (e) => {
    const letter = String.fromCharCode(e.charCode)
    if (/^[a-zA-Z]$/.test(letter)) handleGuess(letter.toUpperCase())
})

// ── START GAME ────────────────────────────────────────────────────────────
const startGame = async () => {
    currentPlayer = await selectPlayer()

    score = 0
    updateScore()

    boardEl.innerHTML = '<div class="board-loading">Loading puzzle...</div>'
    statusEl.className = 'status-message'
    statusEl.textContent = ''

    document.querySelectorAll('.key').forEach(k => k.className = 'key')

    const puzzle = await getPuzzle('4');
    game = new Hangman(puzzle, MAX_GUESSES)

    buildBoard(puzzle)
    updateHP()
}

// ── INIT ──────────────────────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  document.body.style.visibility = 'visible';
});
bestEl.textContent = bestScore
document.getElementById('reset').addEventListener('click', startGame)
startGame()