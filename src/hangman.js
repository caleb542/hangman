if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = Array.prototype.forEach;
}

class Hangman {
    constructor(word, remainingGuesses) {
        this.word = word.toLowerCase().split('')
        this.remainingGuesses = remainingGuesses
        this.guessedLetters = []
        this.status = 'playing'
       
    }
    

    calculateStatus() {
        const finished = this.word.every((letter) => this.guessedLetters.includes(letter) || letter === ' ')
       
        if (this.remainingGuesses === 0) {
            this.status = 'failed'
        } else if (finished) {
            this.status = 'finished'
        } else {
            this.status = 'playing'
        }
    }
    get statusMessage() {
        if (this.status === 'playing') {
            
            let color;
                if (this.remainingGuesses > 4){
                    color = 'lightgreen'
                }
                if (this.remainingGuesses < 2) {
                    color = 'red'
                }
                if (this.remainingGuesses >= 2 && this.remainingGuesses <=4){
                    color='yellow'
                }
        
        return `<span style="color:${color}">${ this.remainingGuesses } ${this.remainingGuesses === 1 ? 'guess':'guesses '} remaining</span>`
        
        } else if (this.status === 'failed') {
            return `Nice try, but the correct phrase is "${this.word.join('')}".`
        } else {
            return 'Great work! You guessed correctly.'
        }
    }
    get puzzle() {
        let puzzle = ''

        this.word.forEach((letter) => {
            if (this.guessedLetters.includes(letter) || letter === ' ') {
                puzzle += letter
            } else {
                puzzle += '*'
            }
        })

        return puzzle
    }
    makeGuess(guess) {
        guess = guess.toLowerCase()
        const spans = document.querySelectorAll('#guessed .alphabet a');
        spans.forEach((span) =>{
            span.textContent.toLowerCase() === guess ? span.classList.add('cross-out'):span.classList.add('normal');
        })
        const isUnique = !this.guessedLetters.includes(guess)
        const isBadGuess = !this.word.includes(guess)

        if (this.status !== 'playing') {
            return
        }

        if (isUnique) {
            this.guessedLetters.push(guess)
        }
       
    

        if (isUnique && isBadGuess) {
            this.remainingGuesses--
        }

        this.calculateStatus()
    }
}

export { Hangman as default }