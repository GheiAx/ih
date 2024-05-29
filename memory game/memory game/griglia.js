let gameGrid = document.querySelector('.game-grid');
let symbols = ['⭐', '❤', '☀', '✨', '☁', '♦', '♣', '♠', '♫', '☎', '✉', '♨', '✿', '☮', '⁂', '❦', '⚡', '✈'];
let symbolsPairs = symbols.concat(symbols);
for (let i = symbolsPairs.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [symbolsPairs[i], symbolsPairs[j]] = [symbolsPairs[j], symbolsPairs[i]];
}
let countdown = 3;

function updateCountdown() {
    let countdownDisplay = document.querySelector('.countdown-display');
    countdownDisplay.textContent = countdown;
    countdown--;
    if (countdown < 0) {
        clearInterval(intervalId);
        countdownDisplay.classList.add('hidden');
        startGame();
    }
}

function startGame() {
    let cards = document.querySelectorAll('.card');
    cards.forEach(function(card) {
        card.addEventListener('click', cardClickHandler);
    });
    let symbols = document.querySelectorAll('.symbol');
    symbols.forEach(function(symbol) {
        symbol.textContent = '';
    });
}

function cardClickHandler() {
    let index = parseInt(this.dataset.index);
    let symbol = symbolsPairs[index];
    let symbolElement = this.querySelector('.symbol');

    if (this.classList.contains('matched')) {
        return;
    }

    symbolElement.textContent = symbol;

    if (previousClickedCard) {
        if (symbol === previousSymbol) {
            playerScore++;
            document.getElementById('player-score').textContent = playerScore;
            this.classList.add('matched');
            previousClickedCard.classList.add('matched');

            document.getElementById('audio-correct').play();

            previousClickedCard = null;
            previousSymbol = null;
        } else {
            let currentCard = this;
            let prevCard = previousClickedCard;
            setTimeout(function() {
                symbolElement.textContent = '';
                let prevSymbolElement = prevCard.querySelector('.symbol');
                prevSymbolElement.textContent = '';
                currentCard.classList.remove('selected');
                prevCard.classList.remove('selected');
                previousClickedCard = null;
                previousSymbol = null;
            }, 1000);

            document.getElementById('audio-wrong').play();

            setTimeout(cpuChooseCards, 1000);
        }
    } else {
        previousClickedCard = this;
        previousSymbol = symbol;
        this.classList.add('selected');
    }
}

function disableCardClicks() {
    let cards = document.querySelectorAll('.card');
    cards.forEach(function(card) {
        card.removeEventListener('click', cardClickHandler);
    });
}

function enableCardClicks() {
    let cards = document.querySelectorAll('.card');
    cards.forEach(function(card) {
        card.addEventListener('click', cardClickHandler);
    });
}

function cpuChooseCards() {
    let unmatchedCards = document.querySelectorAll('.card:not(.matched)');
    let randomIndexes = [];

    while (randomIndexes.length < 2) {
        let randomIndex = Math.floor(Math.random() * unmatchedCards.length);
        if (!randomIndexes.includes(randomIndex)) {
            randomIndexes.push(randomIndex);
        }
    }

    let card1 = unmatchedCards[randomIndexes[0]];
    let card2 = unmatchedCards[randomIndexes[1]];

    let symbol1 = symbolsPairs[parseInt(card1.dataset.index)];
    let symbol2 = symbolsPairs[parseInt(card2.dataset.index)];

    card1.querySelector('.symbol').textContent = symbol1;
    card2.querySelector('.symbol').textContent = symbol2;

    if (symbol1 === symbol2) {
        cpuScore++;
        document.getElementById('cpu-score').textContent = cpuScore;

        card1.classList.add('matched');
        card2.classList.add('matched');

        let allMatched = document.querySelectorAll('.card:not(.matched)').length === 0;
        if (allMatched) {
            
        }

    } else {
        setTimeout(function() {
            card1.querySelector('.symbol').textContent = '';
            card2.querySelector('.symbol').textContent = '';
        }, 3000);
    }
}

for (let i = 0; i < 6; i++) {
    let row = document.createElement('div');
    row.classList.add('row');
    for (let j = 0; j < 6; j++) {
        let card = document.createElement('div');
        card.classList.add('card');
        let index = i * 6 + j;
        let symbol = document.createElement('div');
        symbol.classList.add('symbol');
        symbol.textContent = symbolsPairs[index];
        card.appendChild(symbol);
        card.dataset.index = index;
        row.appendChild(card);
    }
    gameGrid.appendChild(row);
}

let intervalId = setInterval(function() {
    updateCountdown();
    document.getElementById('audio-base').play();
}, 1000);

let playerScore = 0;
let cpuScore = 0;
let lastClickedSymbol = null;

let previousClickedCard = null;
let previousSymbol = null;