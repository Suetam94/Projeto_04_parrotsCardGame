const memoryGame = document.getElementById('memory-game');

const cards = document.querySelectorAll('.memory-card');

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;

function flipCard() {
    if (lockBoard) {
        return;
    }

    if (this === firstCard) {
        return;
    }

    this.classList.toggle('flip');
    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;

        return;
    }

    secondCard = this;

    checkForMatch();
}

function checkForMatch() {
    const isMatch = firstCard.dataset.birds === secondCard.dataset.birds;
    isMatch ? disableCards() : unFlipCards();
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    resetBoard();
}

function unFlipCards() {
    lockBoard = true;

    setTimeout(() => {
        firstCard.classList.remove('flip')
        secondCard.classList.remove('flip')

        resetBoard();
    }, 1300);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

(function shuffle() {
    cards.forEach(card => {
        card.style.order = Math.floor((Math.random() * 12)).toString();
    })
})();

cards.forEach(card => card.addEventListener('click', flipCard));