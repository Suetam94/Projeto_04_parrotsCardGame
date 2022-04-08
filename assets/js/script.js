// Game configs
const parrots = ['bobrossparrot', 'explodyparrot', 'fiestaparrot', 'metalparrot', 'revertitparrot', 'tripletsparrot', 'unicornparrot'];
let clickAttempts = 0;
let nMatches = 0;
let interval = 0;

function gameConfig() {
    const gameConfig = {
        playerName: document.getElementById('name').value ? document.getElementById('name').value : 'Desconhecido',
        nCartas: document.getElementById('nCartas').value
    }

    sessionStorageConfig(gameConfig);

    gameConstructor(gameConfig);
    game();

    initChonometer();
}

function initChonometer() {

    let hours = `00`,
        minutes = `00`,
        seconds = `00`,
        chronometerDisplay = document.querySelector(`[data-chronometer]`),
        chronometerCall;

    function chronometer() {

        seconds++;

        if (seconds < 10) {
            seconds = `0` + seconds;
        }

        if (seconds > 59) {
            seconds = `00`;
            minutes++;

            if (minutes < 10) {
                minutes = `0` + minutes;
            }
        }

        if (minutes > 59) {
            minutes = `00`;
            hours++;

            if (hours < 10) {
                hours = `0` + hours;
            }
        }

        chronometerDisplay.textContent = `${hours}:${minutes}:${seconds}`;

    }

    chronometerCall = setInterval(chronometer, 1000);
    event.target.setAttribute(`disabled`, ``);

    interval = chronometerCall;

    return chronometerCall;
}

function sessionStorageConfig(gameConfig) {
    sessionStorage.clear();
    sessionStorage.setItem('config', JSON.stringify(gameConfig));
}

function gameConstructor(gameConfig) {
    const parrotGame = document.getElementById('parrot-game');
    const config = document.getElementById('config');
    const nParrots = parrots.slice(0, gameConfig.nCartas);

    nParrots.forEach(nParrot => {
        parrotGame.innerHTML += `
        <div class="parrot-card" data-parrots="${nParrot}">
            <img src="./assets/img/${nParrot}.gif" alt="${nParrot}" class="front-face">
            <img src="./assets/img/front.png" alt="Parrot Badge" class="back-face">
        </div>
        <div class="parrot-card" data-parrots="${nParrot}">
            <img src="./assets/img/${nParrot}.gif" alt="${nParrot}" class="front-face">
            <img src="./assets/img/front.png" alt="Parrot Badge" class="back-face">
        </div>`;
    })

    parrotGame.style.display = 'grid';
    parrotGame.style.gridTemplateColumns = `repeat(${gameConfig.nCartas}, auto)`;
    config.style.display = 'none';
}


// Game functions and variables
function game() {
    const cards = document.querySelectorAll('.parrot-card');

    const config = JSON.parse(sessionStorage.getItem('config'));
    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard, secondCard;

    function flipCard() {
        clickAttempts++;

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
        const isMatch = firstCard.dataset.parrots === secondCard.dataset.parrots;
        isMatch ? nMatches++ : '';

        isMatch ? disableCards() : unFlipCards();

        if (nMatches == config.nCartas) {
            setTimeout(() => winnerStats(), 500);
        }
    }

    function winnerStats() {
        const winModal = document.getElementById('winnerModal');
        const playerName = document.getElementById('playerName');
        const attempts = document.getElementById('attempts');
        const time = document.getElementById('time');

        playerName.innerText = 'Jogador: ' + config.playerName;
        attempts.innerText = 'Tentativas: ' + clickAttempts;
        time.innerText = 'Tempo total: ' + document.querySelector(`[data-chronometer]`).textContent;
        clearInterval(interval);
        winModal.style.display = 'block';
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
}