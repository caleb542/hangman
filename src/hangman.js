class Hangman {
    constructor(word, remainingGuesses) {
        this.word = word.toLowerCase().split('')
        this.remainingGuesses = remainingGuesses
        this.guessedLetters = []
        this.status = 'playing'
    }

    calculateStatus() {
        const finished = this.word.every(
            (letter) => this.guessedLetters.includes(letter) || letter === ' '
        )

        if (this.remainingGuesses === 0) {
            this.status = 'failed'
        } else if (finished) {
            this.status = 'finished'
        } else {
            this.status = 'playing'
        }
    }

    makeGuess(guess) {
        guess = guess.toLowerCase()

        if (this.status !== 'playing') return

        const isUnique = !this.guessedLetters.includes(guess)
        const isBadGuess = !this.word.includes(guess)

        if (isUnique) {
            this.guessedLetters.push(guess)
        }

        if (isUnique && isBadGuess) {
            this.remainingGuesses--
        }

        this.calculateStatus()

        return {
            isUnique,
            isBadGuess,
            isCorrect: isUnique && !isBadGuess,
            letter: guess
        }
    }

    get puzzle() {
        return this.word.map(
            (letter) => (this.guessedLetters.includes(letter) || letter === ' ') ? letter : '*'
        ).join('')
    }

    get solvedLetters() {
        return this.word.filter(l => l !== ' ' && this.guessedLetters.includes(l))
    }
}

export { Hangman as default }