import Hangman from './hangman';
import getPuzzle from './requests';


if (window.NodeList && !NodeList.prototype.forEach) { // polyfill for 'forEach' on IE11
    NodeList.prototype.forEach = Array.prototype.forEach;
}

const puzzleEl = document.querySelector('#puzzle')
const guessesEl = document.querySelector('#guesses')
let game1

window.addEventListener('keypress', (e) => {
    const guess = String.fromCharCode(e.charCode)
    game1.makeGuess(guess)
    render()
})
let spans = document.querySelectorAll("#guessed .alphabet a");
spans.forEach(span => {
    span.addEventListener('click', (e) => {
        e.preventDefault()
       const guess = e.target.textContent
       // console.(e.target.textContent)
       game1.makeGuess(guess)
       render()
    })
})
const render = () => {
    puzzleEl.innerHTML = ''
    
        game1.puzzle.split(' ').forEach(word => {
            const wordEl = document.createElement('div')
            // Issue: Every time the puzzle is generated the width of the puzzle is determined
            // by the size of the word.  The effect is that the whole puzzle changes width at every
            // reset.  This is not appealing, so some decisions needed to be made.

            // To control the width of the puzzle, word wrapping needs to be possible,
            // and it was, but With each letter wrapped in a span, it meant letters do the 
            // wrapping, not the words.  We need word wrap, not letter wrap.
            // So each word must be contained.

            // The following technique ensures each word in the phrase gets wrapped
            // inside a div, while allowing each of the letters to remain inside a span.
            word.split('').forEach((letter) => {
                const letterEl = document.createElement('span')
                letterEl.textContent = letter
                wordEl.appendChild(letterEl)

            })
            puzzleEl.appendChild(wordEl)
        });
    guessesEl.textContent = game1.statusMessage
}
const startGame = async () => {
    const puzzle = await getPuzzle('4')
    let spans = document.querySelectorAll("#guessed .alphabet a")
    spans.forEach((span) => {span.classList.remove("cross-out")})
    game1 = new Hangman(puzzle, 5)
    render()
}


startGame()

document.querySelector('#reset').addEventListener('click', startGame)

