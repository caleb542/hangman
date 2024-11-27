const puzzleEl = document.querySelector('#puzzle')
const guessesEl = document.querySelector('#guesses')
let game1

window.addEventListener('keypress', (e) => {
    const guess = String.fromCharCode(e.charCode)
    game1.makeGuess(guess)
    render()
})
const render = () => {
    puzzleEl.innerHTML = ''
    const el = document.createElement('span');
        game1.puzzle.split('').forEach((letter) => {
        const letterEl = document.createElement('span')
        letterEl.textContent = letter
        puzzleEl.appendChild(letterEl)
    })
    
    
    
    guessesEl.textContent = game1.statusMessage
}
const startGame = async () => {
    const puzzle = await getPuzzle('2')
    game1 = new Hangman(puzzle, 5)
    const spans = document.querySelectorAll('#guessed .alphabet span');
    spans.classList = "";
    render()
}


startGame()

document.querySelector('#reset').addEventListener('click', startGame)



getCurrentCountry().then((country) => {
    console.log(country.name)
}).catch((error) => {
    console.log(error)
})